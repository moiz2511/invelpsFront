import React from "react";
import "../../../../assets/styles/Landing.css";
import Footer from "../Footer/Footer";
// import Button from "../Utils/Button";
import HomeCard from "../HomeCard";
// imgs
import HeroImg from "../../../../assets/images/Invelps screen.jpg";
import AboutImg from "../../../../assets/images/Our solutions.jpg";
import Filter from "../../../../assets/images/filtering.png";
import Analytics from "../../../../assets/images/analytics.png";
import Finance from "../../../../assets/images/financial-statements.png";
import Bar from "../../../../assets/images/bar-chart.png";
import Mission from "../../../../assets/images/Our mission.jpg";

import { Link as RouterLink } from 'react-router-dom';
import { Button } from "@mui/material";

function Landing() {
  return (
    <div className="homePage">
      <div className="landing-container">
        {/* hero section start */}
        <section className="hero" id="home">
          <div className="hero-inner">
            <div className="hero-textbox">
              <h1>
                Financial analysis application <br /> for informed investing
              </h1>
              <p>Looking for a way to make smarter investment decisions ?</p>
              <h3>Invelps is what you need!</h3>
              <Button
                className="common-button"
                key="sign-up-link"
                component={RouterLink}
                to="/signup"
              >
                SIGN UP NOW
              </Button>
            </div>
            <div className="hero-imagebox">
              <img src={HeroImg} alt="" />
            </div>
          </div>
        </section>
        {/* hero section ends */}
        {/* about section start */}
        <section className="about" id="solutions">
          <div className="about-inner">
            <div className="about-inner-textbox">
              <p>
                With Invelps, get inspired by the strategies of famous investors
                and use them to build your own investment strategy.
              </p>
              <p>
                Also find opportunities with our screener models, and make your
                investment choices after a thorough financial analysis.
              </p>
              <p>
                These templates are based on the criteria used by famous
                investors. They provide you with an initial list of companies
                that deserve further consideration.
              </p>
              <p>
                The choice of the screener model is an important decision, which
                should be based on the individual needs and risk tolerance of
                the user.
              </p>
              <p>
                Invelps offers a variety of models to choose from, so everyone
                can find the one that works best for them.
              </p>
            </div>
            <div className="about-inner-imagebox">
              <img src={AboutImg} alt="" />
            </div>
            <Button
              className="common-button"
              key="solution-sign-up"
              style={{backgroundColor: '#407879', marginTop: "2px"}} 
              component={RouterLink}
              to="/signup"
            >
              EXPLORE OUR SOLUTIONS
            </Button>
          </div>
        </section>
        {/* about section ends */}
        {/* services section starts */}
        <section className="services" id="applications">
          <div className="services-inner">
            <div className="services-inner-textbox">
              <h2>Our applications</h2>
              <p>
                Access powerful financial analysis tools and templates that make
                business diagnosis easy and straightforward.
              </p>
              <Button
                className="common-button"
                key="application-signup"
                component={RouterLink}
                to="/signup"
                style={{ width: "100%" }}
              >
                ALL APPLICATIONS
              </Button>
            </div>
            <HomeCard
              text="Build your own magic formula. Combine metrics to narrow the list of companies that merit deep analysis."
              heading="Stock Screener"
              img={Filter}
            />
            <HomeCard
              text="Use a wide variety of analytical tools to investigate, and validate your insights."
              heading="Data Analysis"
              img={Analytics}
            />
            <HomeCard
              text="Leverage the financial data of listed companies to characterize their econimic and financial situation."
              heading="Financial data"
              img={Finance}
            />
            <HomeCard
              text="Visualize any metric, compare to normative value and industry to get the story emerge."
              heading="Chart analysis"
              img={Bar}
            />
            <div className="services-inner-textbox">
              <h2 style={{ color: "black", fontSize: "22px" }}>
                {" "}
                Make better investment decisions.
              </h2>
              <ul>
                <li>
                  Get an initial list of interesting companies to analyze.
                </li>
                <li>
                  Leverage financials data analytical tools to assess the
                  performance and evaluate the risk level of companies
                </li>
                <li>Make decisions based on real data today!</li>
              </ul>
            </div>
          </div>
        </section>
        {/* services section ends */}
        {/* mission section starts */}
        <section className="mission" id="aboutus">
          <div className="mission-inner">
            <div className="mission-inner-img-container">
              <img src={Mission} alt="" />
            </div>
            <div className="mission-inner-text-container">
              <h2 style={{ margin: "0", padding: "0" }}>Our Mission</h2>
              <p>
                Invelps makes it possible for anyone to get started with
                financial analysis, regardless of prior experience or
                knowledge.
              </p>

              <p>
                The financial analysis process can often seems complex and
                closed to those who are not financial savvy. Invelps breaks down
                these barriers, making the process more accessible and user
                friendly. With a wide variety of customizable visuals, Invelps
                allows you to share your knowledge and progress with others.
              </p>
              <ul className="mission-inner-text-container--list">
                <li>
                  <span>Simplify what seems complex.</span>
                </li>
                <li>
                  <span>Combine theoretical and practical knowledge.</span>
                </li>
                <li>
                  <span>Get to know yourself.</span>
                </li>
                <li>
                  <span>Learn or even improve your financial analysis.</span>
                </li>
                <li>
                  <span>
                    Save you time on the long road to investing in the stock
                    market.
                  </span>
                </li>
              </ul>
              <Button
                className="common-button"
                key="getStarted-signup"
                component={RouterLink}
                to="/signup"
              >
                GET STARTED
              </Button>
            </div>
          </div>
        </section>
      </div>
      {/* mission section ends */}
      <Footer />
    </div>
  );
}

export default Landing;
