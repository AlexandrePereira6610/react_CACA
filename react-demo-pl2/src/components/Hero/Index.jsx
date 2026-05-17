import './Hero.css';

export default function Hero({ id, title, description }) {
  return (
    <div className={id}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}