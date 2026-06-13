const prisma = require("../prisma");
const { emitNotification } = require("../socket");

const getCurrentMonth = () => {
  const now = new Date();

  return now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const applyForProperty = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (req.user.role !== "TENANT") {
      return res.status(403).json({
        success: false,
        message: "Only tenants can apply",
      });
    }

    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const existingApplication = await prisma.tenantApplication.findFirst({
      where: {
        tenantId: req.user.id,
        propertyId,
      },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "Already applied",
      });
    }

    const application = await prisma.tenantApplication.create({
      data: {
        tenantId: req.user.id,
        propertyId,
      },
      include: {
        property: true,
      },
    });

    const notification = await prisma.notification.create({
      data: {
        userId: property.ownerId,
        title: "New Tenant Application",
        message: `${req.user.name} applied for ${property.title}.`,
        type: "NEW_APPLICATION",
      },
    });

    console.log("Owner notification userId:", notification.userId);

    emitNotification(notification.userId, notification);

    res.status(201).json({
      success: true,
      message: "Application submitted",
      application,
      notification,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getOwnerApplications = async (req, res) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({
        success: false,
        message: "Only owners allowed",
      });
    }

    const applications = await prisma.tenantApplication.findMany({
      where: {
        property: {
          ownerId: req.user.id,
        },
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        property: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (status !== "APPROVED" && status !== "REJECTED") {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (req.user.role !== "OWNER") {
      return res.status(403).json({
        success: false,
        message: "Only owners allowed",
      });
    }

    const application = await prisma.tenantApplication.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        property: true,
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.property.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const currentMonth = getCurrentMonth();

    const result = await prisma.$transaction(async (tx) => {
      const updatedApplication = await tx.tenantApplication.update({
        where: {
          id: applicationId,
        },
        data: {
          status,
        },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          property: true,
        },
      });

      let payment = null;
      let notification = null;

      if (status === "APPROVED") {
        const existingPayment = await tx.payment.findFirst({
          where: {
            tenantId: application.tenantId,
            propertyId: application.propertyId,
            month: currentMonth,
          },
        });

        if (!existingPayment) {
          payment = await tx.payment.create({
            data: {
              tenantId: application.tenantId,
              propertyId: application.propertyId,
              amount: application.property.price,
              month: currentMonth,
              status: "PENDING",
              method: "MANUAL",
            },
          });
        } else {
          payment = existingPayment;
        }

        notification = await tx.notification.create({
          data: {
            userId: application.tenantId,
            title: "Application Approved",
            message: `Your application for ${application.property.title} has been approved. Rent payment has been generated.`,
            type: "APPLICATION_APPROVED",
          },
        });
      }

      if (status === "REJECTED") {
        notification = await tx.notification.create({
          data: {
            userId: application.tenantId,
            title: "Application Rejected",
            message: `Your application for ${application.property.title} has been rejected.`,
            type: "APPLICATION_REJECTED",
          },
        });
      }

      return {
        updatedApplication,
        payment,
        notification,
      };
    });

    if (result.notification) {
      console.log("Tenant notification userId:", result.notification.userId);
      emitNotification(result.notification.userId, result.notification);
    }

    res.status(200).json({
      success: true,
      message:
        status === "APPROVED"
          ? "Application approved and payment created"
          : "Application rejected",
      application: result.updatedApplication,
      payment: result.payment,
      notification: result.notification,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  applyForProperty,
  getOwnerApplications,
  updateApplicationStatus,
};