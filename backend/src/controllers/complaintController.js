const prisma = require("../prisma");

const createComplaint = async (req, res) => {
  try {
    const { title, description, propertyId } = req.body || {};

    if (!title || !description || !propertyId) {
      return res.status(400).json({
        message: "Title, description and property are required",
      });
    }

    if (req.user.role !== "TENANT") {
      return res.status(403).json({
        message: "Only tenants can create complaints",
      });
    }

    const approvedApplication = await prisma.tenantApplication.findFirst({
      where: {
        tenantId: req.user.id,
        propertyId,
        status: "APPROVED",
      },
    });

    if (!approvedApplication) {
      return res.status(403).json({
        message: "You can only create complaints for approved properties",
      });
    }

    const image = req.file ? req.file.path : null;

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        propertyId,
        image,
        createdById: req.user.id,
      },
      include: {
        property: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        jobs: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                email: true,
                skill: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: "Complaint created",
      complaint,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    let where = {};

    if (req.user.role === "TENANT") {
      const approvedApplications =
        await prisma.tenantApplication.findMany({
          where: {
            tenantId: req.user.id,
            status: "APPROVED",
          },
          select: {
            propertyId: true,
          },
        });

      const approvedPropertyIds = approvedApplications.map(
        (application) => application.propertyId
      );

      where = {
        propertyId: {
          in: approvedPropertyIds,
        },
      };
    }

    if (req.user.role === "OWNER") {
      where = {
        property: {
          ownerId: req.user.id,
        },
      };
    }

    if (req.user.role === "WORKER") {
      where = {
        jobs: {
          some: {
            workerId: req.user.id,
          },
        },
      };
    }

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        property: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        jobs: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                email: true,
                skill: true,
                rating: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      complaints,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
};