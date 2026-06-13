const prisma = require("../prisma");

const createComplaint = async (req, res) => {
  try {
    const { title, description, propertyId } = req.body || {};

    if (!title || !description || !propertyId) {
      return res.status(400).json({
        message: "Title, description and property are required",
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        propertyId,
        image,
        createdById: req.user.id,
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
    const complaints = await prisma.complaint.findMany({
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