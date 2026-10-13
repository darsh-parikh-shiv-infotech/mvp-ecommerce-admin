interface HeroBackgroundCircleProp {
  positionClass: string;
  width: number;
  height: number;
}
const HeroBackgroundCircle = ({ positionClass, width, height }: HeroBackgroundCircleProp) => {
  return (
    <svg
      className={`absolute ${positionClass} text-rose-200 pointer-events-none animate-bounce`}
      width={width}
      height={height}
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="300" cy="300" r="300" fill="currentColor" opacity="0.5" />
    </svg>
  );
};

export default HeroBackgroundCircle;
