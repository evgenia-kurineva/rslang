import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Figure from 'react-bootstrap/Figure';
import volumeImg from '../../assets/icons/volume.svg';
import styles from './AudioCallGame.module.css';
import {
  isGameEnd,
  playWord,
  playWords,
  pushWrongAnswers,
  setCurrentWord,
  setCurrentWordIndex,
  setPlayWordsArray,
} from '../../features/audiocall/audiocallSlice';
import { sound } from '../../utils/sound';
import { ARROW_CODE, ENTER_CODE, games, PLUS_CODE, volume } from '../../const/games';
import PossibleAnswerOfAudioCall from '../PossibleAnswerOfAudioCall/PossibleAnswerOfAudioCall';
import EndAudioCall from '../EndAudioCall/EndAudioCall';
import { soundsVolume } from '../../features/games/gamesSlice';
import GameHeader from '../GameHeader/GameHeader';
import DescriptionAudioCall from '../DescriptionAudioCall/DescriptionAudioCall';

const wrongSound = 'assets/sounds/wrong.mp3';

const text = {
  color: '#000',
  fontSize: '1.1rem',
  fontWeight: 600,
};
const gameField = {
  cursor: 'default',
  backgroundColor: '#fdff95',
};
const root = {
  padding: 0,
};

const AudioCallGame = (): JSX.Element => {
  const gameRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  const words = useSelector(playWords);
  const currentWord = useSelector(playWord);
  const isAudioCallGameEnd = useSelector(isGameEnd);
  const soundVolume = useSelector(soundsVolume);

  const dispatch = useDispatch();

  const [isShowAnswer, setIsShowAnswer] = React.useState(false);
  const [isNewGame, setIsNewGame] = React.useState(false);
  const [isFirstClick, setIsFirstClick] = React.useState(true);
  const [pressedKeyboardKey, setPressedKeyboardKey] = React.useState('');

  React.useEffect(() => {
    if (currentWord && !isAudioCallGameEnd) {
      const soundUrl = `${process.env.REACT_APP_BASE_URL}/${currentWord.audio}`;
      sound.playSound(soundUrl, volume);
    }
  }, [currentWord]);

  const onSoundImgClick = () => {
    if (currentWord) {
      const soundUrl = `${process.env.REACT_APP_BASE_URL}/${currentWord.audio}`;
      sound.playSound(soundUrl, volume);
    }
  };

  const onDontKnowBtnClick = () => {
    setIsFirstClick(false);
    setIsNewGame(false);
    setIsShowAnswer(true);
    sound.playSound(wrongSound, soundVolume);
    if (currentWord) {
      dispatch(pushWrongAnswers(currentWord));
    }
  };

  const onNextBtnClick = () => {
    setIsShowAnswer(false);
    dispatch(setCurrentWordIndex());
    dispatch(setCurrentWord());
    dispatch(setPlayWordsArray());
    setIsNewGame(true);
    setIsFirstClick(true);
  };

  const handlerOnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (gameRef) {
      setPressedKeyboardKey(event.key);
      if (event.key === ENTER_CODE && !isShowAnswer) {
        onDontKnowBtnClick();
      } else if (event.key === ARROW_CODE && isShowAnswer) {
        onNextBtnClick();
      } else if (event.key === PLUS_CODE) {
        onSoundImgClick();
      }
    }
  };

  return (
    <Container fluid style={root}>
      {!isAudioCallGameEnd && (
        <div
          ref={gameRef}
          role="button"
          tabIndex={0}
          onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => handlerOnKeyDown(event)}
          className={styles.gameField}
          style={gameField}
        >
          <GameHeader color={games[0].color} soundVolume={soundVolume} gameRef={gameRef} />
          <Container fluid className={styles.container}>
            {!isShowAnswer && (
              <Row className={styles.heightWordImg}>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Image className={styles.img} width="60" height="auto" src={volumeImg} onClick={onSoundImgClick} />
                </Col>
              </Row>
            )}
            {isShowAnswer && currentWord && (
              <Row className={styles.heightWordImg}>
                <Col className={styles.left} lg={6} md={6} sm={6} xs={12}>
                  <Image className={styles.img} width="50" height="auto" src={volumeImg} onClick={onSoundImgClick} />
                </Col>
                <Col className={styles.right} lg={6} md={6} sm={6} xs={12}>
                  <Figure>
                    <Figure.Image
                      width="50%"
                      height="auto"
                      alt="рисунок для слова"
                      src={`${process.env.REACT_APP_BASE_URL}/${currentWord.image}`}
                    />
                    <Figure.Caption style={text}>{currentWord.word}</Figure.Caption>
                  </Figure>
                </Col>
              </Row>
            )}
            <Row>
              <Col className={styles.words} lg={12}>
                {words &&
                  words.map((word, index) => (
                    <PossibleAnswerOfAudioCall
                      key={word.id}
                      currentWord={currentWord}
                      word={word}
                      index={index}
                      isShowAnswer={isShowAnswer}
                      setIsShowAnswer={setIsShowAnswer}
                      isNewGame={isNewGame}
                      setIsNewGame={setIsNewGame}
                      isFirstClick={isFirstClick}
                      setIsFirstClick={setIsFirstClick}
                      soundVolume={soundVolume}
                      pressedKeyboardKey={pressedKeyboardKey}
                    />
                  ))}
              </Col>
            </Row>
            <Row>
              {!isShowAnswer && (
                <Col lg={12}>
                  <Button onClick={onDontKnowBtnClick} variant="outline-dark">
                    Не знаю
                  </Button>
                </Col>
              )}
              {isShowAnswer && (
                <Col lg={12}>
                  <Button onClick={onNextBtnClick} variant="outline-dark">
                    Далее
                  </Button>
                </Col>
              )}
            </Row>
            <DescriptionAudioCall />
          </Container>
        </div>
      )}
      {isAudioCallGameEnd && <EndAudioCall color="yellow" />}
    </Container>
  );
};

export default AudioCallGame;
