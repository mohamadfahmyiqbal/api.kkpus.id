// controllers/program/getProgramOptions.js

const getProgramOptions = async (req, res) => {
  try {
    const options = [
      { label: "Pinjaman Lunak", key: "pinjaman" },
      { label: "Arisan", key: "arisan" },
    ];

    res.json({ success: true, data: options });
  } catch (error) {
    console.error("Error in getProgramOptions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default getProgramOptions;
