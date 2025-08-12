// api/majorCounsel.js
const contacts = require("../data/contacts.json");

const send = (res, obj) => {
  res
    .status(200)
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

    if (!dept) {
      return send(res, {
        version: "2.0",
        template: {
          outputs: [
            {
              simpleText: {
                text:
                  "학과명을 인식하지 못했어요 😥 ‘웹툰 배우는 학과’, ‘반려동물 관련 학과’처럼 다시 물어봐 주세요."
              }
            }
          ]
        }
      });
    }

    const info = contacts[dept];
    if (!info) {
      const quickReplies = Object.keys(contacts)
        .slice(0, 8)
        .map((name) => ({
          action: "message",
          label: name,
          messageText: `${name} 상담 안내`
        }));

      return send(res, {
        version: "2.0",
        template: {
          outputs: [
            {
              simpleText: {
                text: `‘${dept}’ 학과를 찾지 못했어요 😥 아래에서 선택해 주세요.`
              }
            }
          ],
          quickReplies
        }
      });
    }

    const thumb = info?.thumbnail || "https://rise-name-v2.vercel.app/images/basic.png";
    const hours = info?.hours || "09:00 - 17:00";

    const desc =
      `안녕하세요! ${dept}에 관심 가져주셔서 감사합니다 😊\n` +
      `해당 전공에 대한 궁금증은 아래 담당 교수님께 1:1 상담 요청하실 수 있습니다.\n\n` +
      `👩‍🏫 담당 교수: ${info.prof || "-"}\n` +
      `📞 전화번호: ${info.phone || "-"}\n` +
      `📩 이메일: ${info.email || "-"}\n` +
      `⌚ 전화 및 상담 시간:  ${info.hours || "-"}`;

    // 버튼을 안전하게 동적 구성
    const buttons = [];
    if (info.phone) {
      buttons.push({ action: "phone", label: "📞 전화하기", phoneNumber: info.phone });
    }
    if (info.homepage) {
      buttons.push({ action: "webLink", label: "📎 학과 안내 페이지", webLinkUrl: info.homepage });
    }
    if (info.openchat) {
      buttons.push({ action: "webLink", label: "💬 오픈채팅", webLinkUrl: info.openchat });
    }

    return send(res, {
      version: "2.0",
      template: {
        outputs: [
          {
            basicCard: {
              title: `🎓 ${dept} 상담 안내`,
              thumbnail: { imageUrl: thumb },
              description: desc,
              buttons
            }
          }
        ],
        quickReplies: [
          { action: "message", label: "다른 학과", messageText: "다른 학과 상담" }
        ]
      }
    });
  } catch (e) {
    console.error("[majorCounsel]", e);
    return send(res, {
      version: "2.0",
      template: {
        outputs: [
          { simpleText: { text: "요청 처리 중 오류가 발생했어요 😥" } }
        ]
      }
    });
  }
};
