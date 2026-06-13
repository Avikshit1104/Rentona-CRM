const prisma = require("../prisma");

const createPayment = async (req, res) => {
  try {
    const { amount, month, propertyId, method, transactionId } = req.body;

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        month,
        propertyId,
        tenantId: req.user.id,
        method: method || "MANUAL",
        transactionId,
        status: "PENDING",
      },
    });

    res.status(201).json({
      message: "Payment record created",
      payment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        tenantId: req.user.id,
      },
      include: {
        property: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getOwnerPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
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
          },
        },
        property: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const markPaymentPaid = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    const payment = await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "SUCCESS",
        transactionId,
      },
      include: {
        property: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: payment.tenantId,
        title: "Payment Successful",
        message: `Your rent payment of ₹${payment.amount} for ${payment.month} was successful.`,
        type: "PAYMENT_SUCCESS",
      },
    });

    await prisma.notification.create({
      data: {
        userId: payment.property.ownerId,
        title: "Rent Payment Received",
        message: `Rent payment of ₹${payment.amount} for ${payment.property.title} was received.`,
        type: "PAYMENT_RECEIVED",
      },
    });

    res.status(200).json({
      message: "Payment marked as successful",
      payment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const markPaymentFailed = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "FAILED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: payment.tenantId,
        title: "Payment Failed",
        message: `Your rent payment for ${payment.month} failed. Please try again.`,
        type: "PAYMENT_FAILED",
      },
    });

    res.status(200).json({
      message: "Payment marked as failed",
      payment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createPayment,
  getMyPayments,
  getOwnerPayments,
  markPaymentPaid,
  markPaymentFailed,
};