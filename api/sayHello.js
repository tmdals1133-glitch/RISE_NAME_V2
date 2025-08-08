module.exports = (_req, res) => {
  res.status(200).json({
    version: "2.0",
    template: { outputs: [{ simpleText: { text: "안녕" } }] }
  });
};