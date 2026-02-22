const BLOBS = [
  {
    width: "55vw",
    height: "45vh",
    top: "2%",
    right: "-8%",
    background:
      "radial-gradient(ellipse, rgba(255,60,95,0.28) 0%, transparent 70%)",
    filter: "blur(80px)",
    animation: "float 20s ease-in-out infinite",
  },
  {
    width: "50vw",
    height: "50vh",
    top: "35%",
    left: "-10%",
    background:
      "radial-gradient(ellipse, rgba(88,86,214,0.24) 0%, transparent 70%)",
    filter: "blur(90px)",
    animation: "float 30s ease-in-out infinite reverse",
  },
  {
    width: "40vw",
    height: "35vh",
    bottom: "8%",
    left: "25%",
    background:
      "radial-gradient(ellipse, rgba(52,199,89,0.20) 0%, transparent 70%)",
    filter: "blur(90px)",
    animation: "float 35s ease-in-out infinite",
    animationDelay: "5s",
  },
  {
    width: "30vw",
    height: "25vh",
    top: "15%",
    left: "10%",
    background:
      "radial-gradient(ellipse, rgba(255,159,10,0.10) 0%, transparent 70%)",
    filter: "blur(100px)",
    animation: "float 28s ease-in-out infinite",
    animationDelay: "8s",
  },
  {
    width: "35vw",
    height: "30vh",
    bottom: "15%",
    right: "5%",
    background:
      "radial-gradient(ellipse, rgba(90,200,250,0.10) 0%, transparent 70%)",
    filter: "blur(100px)",
    animation: "float 32s ease-in-out infinite reverse",
    animationDelay: "12s",
  },
  {
    width: "38vw",
    height: "32vh",
    bottom: "5%",
    left: "-5%",
    background:
      "radial-gradient(ellipse, rgba(255,180,50,0.12) 0%, transparent 70%)",
    filter: "blur(100px)",
    animation: "float 15s ease-in-out infinite",
    animationDelay: "3s",
  },
  {
    width: "36vw",
    height: "28vh",
    top: "-4%",
    left: "30%",
    background:
      "radial-gradient(ellipse, rgba(0,210,220,0.12) 0%, transparent 70%)",
    filter: "blur(90px)",
    animation: "float 15s ease-in-out infinite reverse",
    animationDelay: "6s",
  },
];

export default function BackgroundLayer() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-dark" />
      {BLOBS.map((style, i) => (
        <div key={i} className="blob-animated absolute" style={style} />
      ))}
    </div>
  );
}
