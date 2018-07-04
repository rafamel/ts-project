import React from 'react';
import PropTypes from 'prop-types';
import { withContext } from 'cxt';
import { Redirect } from 'react-router-dom';
import LottiePlayer from '@commons/elements/LottiePlayer';
import lottiePingPong from '@static/lottie/ping_pong.json';
import logger from 'logger';

@withContext('styles', ({ theme }) => ({
  root: {
    padding: '60px 25px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 'calc(100vh - 160px)',
    textAlign: 'center',
    [theme.breakpoints.media('tablet')]: {
      height: 'calc(100vh - 180px)'
    }
  },
  h1: {
    marginBottom: 18
  },
  player: {
    maxWidth: 400,
    margin: 'auto'
  }
}))
class Info extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  };
  state = {
    redirect: false,
    info: null
  };
  setRedirect = (redirect) => {
    setTimeout(() => {
      if (!this._isMounted) return;
      this.setState({ redirect });
    }, 3500);
  };
  setInfo = (location) => {
    try {
      const info = location.state.info;
      if (!info.message || !info.data) throw Error();
      this.setState({ info });
      if (info.redirect) this.setRedirect(info.redirect);
    } catch (e) {
      this.setState({
        info: {
          loop: true,
          message: "We couldn't find the page you're looking for!",
          data: lottiePingPong
        }
      });
      logger.debug('location.state.info was not present for Info component');
    }
  };
  // eslint-disable-next-line
  UNSAFE_componentWillMount() {
    this._isMounted = true;
    this.setInfo(this.props.location);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    const { styles } = this.props;
    const { info, redirect } = this.state;
    return (
      <React.Fragment>
        <div css={styles.root}>
          <div>
            <h1 css={styles.h1}>{info.message}</h1>
            {info && (
              <LottiePlayer
                css={styles.player}
                data={info.data}
                loop={info.loop || false}
              />
            )}
          </div>
        </div>
        {redirect && <Redirect to={redirect} />}
      </React.Fragment>
    );
  }
}

export default Info;
