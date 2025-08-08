module.exports = (_req, res) => {
  res.status(200).json({
    version: "2.0",
    template: {
      outputs: [{
        simpleImage: {
          imageUrl: "https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/brand/brandCharacter/ryan.png",
          altText: "라이언이 손을 흔들어요"
        }
      }]
    }
  });
};