import React from "react";
import News from "./news/News";
import styles from "./NewsStack.module.css";

const newsData = [
  {
    imageSrc: "sampleImage1.png",
    time: "5m",
    title: "Stocks edge higher before the Fed's announcement",
    description:
      "U.S. stocks rise ahead of the Federal Reserve meeting minutes which may hint at whether interest rates will continue ...",
    footerInfo: "Acme News",
  },
  {
    imageSrc: "sampleImage2.png",
    time: "10m",
    title: "European stocks fall amid economic concerns",
    description:
      "Stocks in Europe saw a decline today as concerns over economic slowdown increased, causing widespread uncertainty among investors.",
    footerInfo: "Beta News",
  },
];

const NewsStack = () => {
  return (
    <div className={styles.newsStack}>
      {newsData.map((newsItem, index) => (
        <News
          key={index}
          imageSrc={newsItem.imageSrc}
          time={newsItem.time}
          title={newsItem.title}
          description={newsItem.description}
          footerInfo={newsItem.footerInfo}
        />
      ))}
    </div>
  );
};

export default NewsStack;
