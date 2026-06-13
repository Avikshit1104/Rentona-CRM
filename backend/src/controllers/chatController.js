const prisma = require("../prisma");

// SAVE MESSAGE
const saveMessage = async (
  req,
  res
) => {
  try {
    const { jobId, message } =
      req.body;

    const chat =
      await prisma.chatMessage.create({
        data: {
          jobId,
          message,
          senderId: req.user.id,
        },
      });

    res.status(201).json(chat);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// GET CHAT HISTORY
const getMessages = async (
  req,
  res
) => {
  try {
    const { jobId } = req.params;

    const messages = await prisma.chatMessage.findMany({
      where: { jobId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  saveMessage,
  getMessages,
};