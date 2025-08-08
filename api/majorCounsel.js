const contacts = require("../data/contacts.json");

const send = (res, obj) => {
  res.status(200)
     .setHeader("Content-Type", "application/json; charset=utf-8")
     .send(JSON.stringify(obj));
};

module.exports = (req, res) => {
  try {
    const method = req.method || "GET";
    const body = method === "POST" ? (req.body || {}) : {};
    const dept =
      body?.action?.params?.RISE_name ||
      body?.action?.detailParams?.RISE_name?.value ||
      req.query?.RISE_name ||
      "";

    const info = contacts[dept];

    // ✅ 썸네일 기본값(학과별 값이 없으면 이걸 사용)
    const thumb =
      info?.thumbnail ||
      "https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/brand/brandCharacter/ryan.png";

    if (!dept) {
      return send(res, {
        version: "2.0",
        template: {
          outputs: [
            { simpleText: { text: "학과명을 인식하지 못했어요 😥 ‘웹툰’, ‘펫’처럼 다시 물어봐 주세요." } }
          ]
        }
      });
    }

    if (!info) {
      const quickReplies = Object.keys(contacts).slice(0, 8).map((name) => ({
        action: "message",
        label: name,
        messageText: `${name} 상담 안내`
      }));
      return send(res, {
        version: "2.0",
        template: {
          outputs: [
            { simpleText: { text: `‘${dept}’ 학과를 찾지 못했어요 😥 아래에서 선택해 주세요.` } }
          ],
          quickReplies
        }
      });
    }

    const desc =
      `안녕하세요! ${dept}에 관심 가져주셔서 감사합니다 😊\n` +
      `해당 전공에 대한 궁금증은 아래 담당 교수님께 1:1 상담 요청하실 수 있습니다.\n\n` +
      `👩‍🏫 담당 교수: ${info.prof}\n` +
      `📞 전화번호: ${info.phone}\n` +
      `📩 이메일: ${info.email}\n`;

    return send(res, {
      version: "2.0",
      template: {
        outputs: [
          {
            basicCard: {
              title: `🎓 ${dept} 상담 안내`,
              description: desc,
              // ✅ 여기!
              thumbnail: { imageUrl: thumb },
              buttons: [
                { action: "phone",  label: "📞 전화하기",          phoneNumber: info.phone },
                { action: "webLink", label: "📎 학과 안내 페이지",  webLinkUrl: info.homepage },
                { action: "webLink", label: "💬 오픈채팅",         webLinkUrl: info.openchat }
              ]
            }
          }
        ],
        quickReplies: [{ action: "message", label: "다른 학과", messageText: "다른 학과 상담" }]
      }
    });
  } catch (e) {
    console.error("[majorCounsel]", e);
    return send(res, {
      version: "2.0",
      template: { outputs: [{ simpleText: { text: "요청 처리 중 오류가 발생했어요 😥" } }] }
    });
  }
};
