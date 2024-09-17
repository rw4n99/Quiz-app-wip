"use client";

import React, { useEffect, useState } from 'react';
import styles from './questionCards.module.css';
import Success from '../SuccessScreen/SuccessScreen';
import Fail from '../FailScreen/FailScreen';
import Button from '../Button/Button';
import SubHeader from '../SubHeader/SubHeader';
import EndGame from '../EndGame/EndGame';
import Timer from '../Timer/Timer';

export default function QuestionCards() {
  const [submit, setSubmit] = useState(false);
  const [pass, setPass] = useState(null);
  const [answerSelected, setAnswerSelected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [correctAnswerBox, setCorrectAnswerBox] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  const randomCorrectAnswer = () => {
    const correctAnswerSelector = Math.floor(Math.random() * 4);
    setCorrectAnswerBox(correctAnswerSelector);
  }

  const shuffleAnswers = (correctAnswer, incorrectAnswers) => {
    const allAnswers = [...incorrectAnswers, correctAnswer];
    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }
    setShuffledAnswers(allAnswers);
  }

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://the-trivia-api.com/v2/questions/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setQuestions(data);
      shuffleAnswers(data[0].correctAnswer, data[0].incorrectAnswers);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGameOver = () => {
    setEndGame(true);
  };

  useEffect(() => {
    fetchQuestions();
    randomCorrectAnswer();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleClick = (event) => {
    event.preventDefault();

    if (!answerSelected) {
      setSubmit(true);
      return;
    }

    setSubmit(true);
    if (pass && questionCount < 11 && lives > 0) {
      setScore((prevScore) => prevScore + 1);
      setShowSuccess(true);
      setShowFail(false);
      setQuestionCount((prevCount) => prevCount + 1);
    } else if (!pass && questionCount < 11 && lives > 0) {
      setLives((prevLives) => prevLives - 1);
      setShowFail(true);
      setShowSuccess(false);
      setQuestionCount((prevCount) => prevCount + 1);
    } else {
      setEndGame(true);
    }
  };

  const handleCloseScreens = () => {
    setShowSuccess(false);
    setShowFail(false);
    setAnswerSelected(false);
    setPass(null);
    fetchQuestions();
    randomCorrectAnswer();
  };

  const handleAnswerSelect = (selectedAnswerIndex) => {
    setAnswerSelected(true);
    setPass(shuffledAnswers[selectedAnswerIndex] === questions[0].correctAnswer);
  };

  return (
    <div className={styles.wrapper}>
      {endGame ? (
        <EndGame score={score} lives={lives} />
      ) : (
        <div>
          <Timer onTimerEnd={handleGameOver} />
          <div>
            <SubHeader score={score} progress={questionCount} lives={lives} timer={<Timer />} />
            <div className={styles.form}>
              <legend className={styles.title}>{questions[0].question.text}</legend>

              {shuffledAnswers.map((answer, index) => (
                <div key={index} className={styles.answerGroup}>
                  <input
                    type="radio"
                    id={`Answer${index + 1}`}
                    name="Answer"
                    onClick={() => handleAnswerSelect(index)}
                  />
                  <label className={styles.text} htmlFor={`Answer${index + 1}`}>
                    {answer}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <Button onClick={handleClick}>Submit answer</Button>
            </div>
            <div className={styles.submit}>
              {!answerSelected && submit ? (
                'Please select an answer'
              ) : (
                <>
                  {showSuccess && (
                    <Success onClose={handleCloseScreens} score={score} />
                  )}
                  {showFail && (
                    <Fail onClose={handleCloseScreens} correctAnswerVar={questions[0].correctAnswer} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}