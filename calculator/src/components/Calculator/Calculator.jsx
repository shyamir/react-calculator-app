import React, { useRef, useEffect, useState } from "react";

// Variable length field
import { Textfit } from "react-textfit";

// Stylesheet
import "./calculator.css";

// Config file with button actions
import { btns, ACTIONS } from "./btnConfigs";

const Calculator = () => {
  const btnsRef = useRef(null);
  const expRef = useRef(null);

  const [expression, setExpression] = useState("");

  useEffect(() => {
    const btns = Array.from(btnsRef.current.querySelectorAll("button"));
    btns.forEach((e) => (e.style.height = e.offsetWidth + "px"));
  }, []);

  const btnClick = (item) => {
    const expDiv = expRef.current;

    if (item.action === ACTIONS.ADD) {
      addAnimationSpan(item.display);

      // Check multiplication and exponent operations
      const oper =
        item.display === "x" ? "*" : item.display === "^" ? "**" : item.display;
      setExpression(expression + oper);
    }

    // Clear action
    if (item.action === ACTIONS.DELETE) {
      expDiv.parentNode.querySelector("div:last-child").innerHTML = "";
      expDiv.innerHTML = "";

      setExpression("");
    }

    if (item.action === ACTIONS.CALC) {
      if (expression.trim().length <= 0) return;

      expDiv.parentNode.querySelector("div:last-child").remove();

      const cloneNode = expDiv.cloneNode(true);
      expDiv.parentNode.appendChild(cloneNode);

      const transform = `translateY(${
        -(expDiv.offsetHeight + 10) + "px"
      }) scale(0.4)`;

      try {
        let res = eval(expression);

        setExpression(res.toString());
        setTimeout(() => {
          cloneNode.style.transform = transform;
          expDiv.innerHTML = "";
          addCalculationSpan(
            Math.floor(res * 100000000) / 100000000,
            res.toString().length
          );
        }, 200);
      } catch {
        setTimeout(() => {
          cloneNode.style.transform = transform;
          cloneNode.innerHTML = "Syntax err";
        }, 200);
      } finally {
        console.log("calculation complete");
      }
    }
  };

  // Animation after calculation
  const addCalculationSpan = (content, num) => {
    const expDiv = expRef.current;
    const span = document.createElement("span");

    span.innerHTML = content;
    span.style.opacity = "0";
    expDiv.appendChild(span);

    const width = span.offsetWidth + "px";
    span.style.width = "0";

    if (num >= 10) {
      span.style.fontSize = "30px";
    }

    setTimeout(() => {
      span.style.opacity = "1";
      span.style.width = width;
    }, 100);
  };

  // Animation while pressing keys
  const addAnimationSpan = (content) => {
    const expDiv = expRef.current;
    const span = document.createElement("span");

    span.innerHTML = content;
    span.style.opacity = "0";
    expDiv.appendChild(span);

    const width = span.offsetWidth + "px";
    span.style.width = "0";

    setTimeout(() => {
      span.style.opacity = "1";
      span.style.width = width;
    }, 100);
  };

  return (
    <div className="calculator">
      <Textfit mode="multi" max={70}>
        <div className="calculator__result">
          <div ref={expRef} className="calculator__result__exp"></div>
          <div className="calculator__result__exp"></div>
        </div>
      </Textfit>

      <div ref={btnsRef} className="calculator__btns">
        {btns.map((item, index) => (
          <button
            key={index}
            className={item.class}
            onClick={() => btnClick(item)}
          >
            {item.display}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
