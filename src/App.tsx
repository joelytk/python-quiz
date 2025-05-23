import { useEffect, useState } from 'react';

type Question = {
  question: string;
  codeSnippet?: string;
  options: string[];
  answer: string;
};

const App = () => {
  const [screen, setScreen] = useState<string>('welcome');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isReview, setIsReview] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('./questions.json');
      const data: Question[] = await res.json();
      const shuffledQuestions = shuffleQuestions(data);
      setQuestions(shuffledQuestions);
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[questionIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleClick = () => {
    if (isReview) {
      setIsReview(false);
      setSelectedOption('');

      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setScreen('result');
      }
    } else {
      if (selectedOption === currentQuestion.answer) {
        setScore(score + 1);
        setIsReview(true);
      } else {
        setIsReview(true);
      }
    }
  };

  const showScoreRemarks = () => {
    if (score === 10) {
      return 'Awesome job! You did grrrrrrrreat!';
    } else if (score >= 8) {
      return "Good job! You did well, but there's some room for improvement...";
    } else if (score >= 6) {
      return 'Oh dear... You need to study harder!';
    } else if (score < 6) {
      return 'I have failed you... :(';
    }
  };

  const shuffleQuestions = (array: Question[]) => {
    const shuffledQuestions = [...array];
    let currentIndex = shuffledQuestions.length;

    // While there remain elements to shuffle
    while (currentIndex != 0) {
      // Pick a remaining element
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element
      [shuffledQuestions[currentIndex], shuffledQuestions[randomIndex]] = [
        shuffledQuestions[randomIndex],
        shuffledQuestions[currentIndex]
      ];
    }

    return shuffledQuestions;
  };

  return (
    <>
      <img
        src='./python.png'
        alt='Python logo'
        className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] -z-1 opacity-25 w-96'
      />
      <div className='container mx-auto p-4 max-w-4xl'>
        {screen === 'welcome' && (
          <div>
            <h1 className='text-center mb-12'>
              Python Quiz: <strong>Lists</strong>
            </h1>
            <button onClick={() => setScreen('quiz')}>Start</button>
          </div>
        )}
        {screen === 'quiz' && (
          <div>
            <div className='flex flex-col gap-4 question-card h-[250px] mb-4'>
              <p className='opacity-75'>
                Question {questionIndex + 1} of {questions.length}
              </p>
              <div className='flex-1 flex items-center justify-center'>
                <div>
                  <h2 className='font-semibold'>{currentQuestion.question}</h2>
                  {currentQuestion.codeSnippet && (
                    <pre className='mt-4 flex flex-col'>
                      {currentQuestion.codeSnippet
                        .split('\n')
                        .map((line, index) => (
                          <code key={index} className='text-white text-left'>
                            {line}
                          </code>
                        ))}
                    </pre>
                  )}
                </div>
              </div>
              <p>&nbsp;</p>
            </div>
            <div
              className={`grid md:grid-cols-2 gap-4 mb-4 ${
                isReview ? 'cursor-not-allowed' : ''
              }`}
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`option ${
                    isReview
                      ? `pointer-events-none ${
                          option === currentQuestion.answer
                            ? 'bg-green-700'
                            : 'bg-red-700'
                        }`
                      : option === selectedOption
                      ? 'bg-primary'
                      : ''
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <div className='option-letter'>{optionLetters[index]}</div>
                  <p>{option}</p>
                </div>
              ))}
            </div>
            <button
              className={
                !isReview && selectedOption === '' ? 'bg-primary/75' : ''
              }
              onClick={handleClick}
              disabled={!isReview && selectedOption === ''}
            >
              {isReview ? 'Next question' : 'Submit answer'}
            </button>
          </div>
        )}
        {screen === 'result' && (
          <div>
            <h1 className='text-center mb-4'>
              Quiz completed!
              <br />
              <strong>You scored...</strong>
            </h1>
            <div className='card mb-4 text-center'>
              <p className='text-7xl font-bold mb-2'>{score}</p>
              <p className='opacity-50'>out of {questions.length}</p>
            </div>
            <pre>
              <code>{showScoreRemarks()}</code>
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
