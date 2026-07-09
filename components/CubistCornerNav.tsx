"use client";

/**
 * Barra fixa no topo da página — padrão da identidade "cubista" (ver
 * design_handoff_homepage_acervo/README.md). Usada em toda página que
 * adota essa identidade (home, acervo, sobre, objeto): sempre os mesmos
 * dois links, alinhados à direita dentro da barra.
 */
export function CubistCornerNav() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 32,
        padding: "0 44px",
        background: "#a9a7a2",
        borderBottom: "1px solid #8e8b86",
        fontFamily: "var(--font-plex-mono), monospace",
        fontSize: 12,
        letterSpacing: "0.14em",
        zIndex: 20,
      }}
    >
      <a
        href="/acervo"
        style={{ textDecoration: "none", color: "#22201d" }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#8c2f1f")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#22201d")}
      >
        acervo
      </a>
      <a
        href="/sobre"
        style={{ textDecoration: "none", color: "#22201d" }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#8c2f1f")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#22201d")}
      >
        sobre
      </a>
    </div>
  );
}
