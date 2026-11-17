module.exports = {
  content: ["./*.html", "./*.js"],
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"] },
      colors: {
        bg: "var(--bg)", card: "var(--card)", ink: "var(--ink)", mute: "var(--mute)", line: "var(--line)",
        brand: "var(--blue)", deep: "var(--deep)", sun: "#FFC21A", wa: "#16A34A", soft: "var(--soft)",
        tagb: "var(--tagb)", warnbg: "var(--warnbg)", warnt: "var(--warnt)", bad: "var(--bad)",
        badbg: "var(--badbg)", okbg: "var(--okbg)", okt: "var(--okt)"
      },
      boxShadow: { card: "var(--sh)" }
    }
  }
};
