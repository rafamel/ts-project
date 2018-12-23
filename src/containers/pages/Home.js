import React from 'react';
import ButtonBase from '@commons/elements/ButtonBase';
import Fade from '@commons/Fade';
import { withContext } from 'cxt';

const styles = ({ theme }) => ({
  root: {
    padding: '45px 60px',
    textAlign: 'center'
  },
  button: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    margin: '10px 5px',
    padding: '6px 8px',
    fontSize: 14,
    borderRadius: 2
  }
});
class Home extends React.Component {
  state = {
    in: true
  };
  handler = () => {
    this.setState((state) => ({
      in: !state.in
    }));
  };
  render() {
    const {
      styles,
      store: { loading, alerts }
    } = this.props;
    return (
      <div css={styles.root}>
        <ButtonBase css={styles.button} onClick={loading.starts}>
          + Loading
        </ButtonBase>
        <ButtonBase css={styles.button} onClick={loading.ends}>
          - Loading
        </ButtonBase>
        <ButtonBase css={styles.button} onClick={this.handler}>
          Fade
        </ButtonBase>
        <Fade in={this.state.in}>This is a transition!</Fade>
        <div>{alerts.notification}</div>
      </div>
    );
  }
}

export default withContext({ styles })(Home);
