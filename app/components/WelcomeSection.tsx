import { imageUrl } from '../lib/image';

export default function WelcomeSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full">
        <img
          src={imageUrl('/images/welcome.jpg')}
          alt="Welcome to our wedding"
          className="w-full object-cover"
        />

        {/* Curved text along top edge */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 430 110"
          className="absolute top-0 left-0 w-full"
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <path id="topArc" d="M 35,95 Q 215,18 395,95" />
          </defs>
          <text
            fill="white"
            fontSize="26"
            fontFamily="Great Vibes, cursive"
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.55))' }}
          >
            <textPath href="#topArc" startOffset="50%" textAnchor="middle">
              Welcome to our wedding
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
