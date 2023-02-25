import "../../../assets/styles/HomeCard.css";

function HomeCard({ img, heading, text, style }) {
  return (
    <div className="home-card" style={style}>
      <img src={img} alt="" />
      <h2>{heading}</h2>
      <p>{text}</p>
    </div>
  );
}

export default HomeCard;
