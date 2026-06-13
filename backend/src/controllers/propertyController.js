const prisma = require("../prisma");

const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      latitude,
      longitude,
    } = req.body;

    // IMAGE FROM MULTER
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    // ROLE CHECK
    if (req.user.role !== "OWNER") {
      return res.status(403).json({
        message:
          "Only owners can create properties",
      });
    }

    const property =
      await prisma.property.create({
        data: {
          title,
          description,

          // FIXED FLOAT VALUES
          price: parseFloat(price),

          location,
          image,

          latitude: latitude
            ? parseFloat(latitude)
            : null,

          longitude: longitude
            ? parseFloat(longitude)
            : null,

          ownerId: req.user.id,
        },
      });

    res.status(201).json({
      message: "Property created",
      property,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProperties = async (
  req,
  res
) => {
  try {
    const properties =
      await prisma.property.findMany({
        include: {
          owner: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getMyProperties = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({
        message:
          "Only owners allowed",
      });
    }

    const properties =
      await prisma.property.findMany({
        where: {
          ownerId: req.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      properties,
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
  createProperty,
  getProperties,
  getMyProperties,
};