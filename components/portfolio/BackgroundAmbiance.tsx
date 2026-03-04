export default function BackgroundAmbiance() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 300,
          background: 'linear-gradient(180deg, rgba(210,230,240,0.06) 0%, #FDFCFA 100%)',
        }}
      />
    </div>
  );
}
