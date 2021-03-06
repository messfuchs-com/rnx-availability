import React, { Component } from 'react';
import { Card, CardContent, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Route, Switch, withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import DatePicker from '../hoc/pickers/DatePicker';

// import {dateToObject} from '../share/formatDate';
import formatDate from '../share/formatDate';
import ProviderList from './ProviderList';


const styles = theme => (
  {
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
    card: {
      minWidth: 275,
      margin: 10
    },
    innerCard: {
      margin: 5
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      marginBottom: 16,
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    button: {
      margin: theme.spacing.unit,
    }
  });


class RinexAvailability extends Component {

  constructor(props) {
    super(props);
    this.state = { date: null };
  }

  generateState(tempDate) {
    const dateStr = formatDate(tempDate);
    let newStateObject = {
      date: dateStr
    };
    this.setState(newStateObject);
    this.onUpdateUrlHandler('/' + formatDate(dateStr));

  }

  componentWillMount() {
    let newDate = new Date();
    newDate = newDate.setDate(newDate.getDate()-1);
    const location = this.props.location.pathname.replace("/", "").split("?")[0];
    if (!(location === "")) {
      newDate = location;
    } 
    this.generateState(newDate);
  }

  onChangeDateHandler = (event) => {
    this.generateState(event.target.value);
  }

  onAddDayHandler = (event) => {
    this.changeDate(1);
  }

  onSubDayHandler = (event) => {
    this.changeDate(-1);
  }

  onUpdateUrlHandler = (newPath) => {
    this.props.history.push({pathname: newPath});
  }

  changeDate(days) {
    const oldDate = new Date(this.state.date);
    let newDate = new Date(oldDate.valueOf());
    newDate.setDate(newDate.getDate() + days);
    this.generateState(newDate);
  }

  render() {

    const Child = ({ match }) => (
      <ProviderList date={ match.params.date } />    
    )
    const { classes } = this.props;    

    return (
      <div>
        <Card className={classes.card} key={"chooseDate"}>
          <CardContent>
            <Grid container spacing={16}>
              <Grid item xs={2}>
                <Button 
                  variant="outlined" 
                  onClick={(event) => this.onSubDayHandler(event)}
                  className={classes.button}>
                      -1d
                </Button>
              </Grid>
              <Grid item xs={4}>
                <DatePicker 
                  date={this.state.date} 
                  changed={(event) => this.onChangeDateHandler(event)}
                />
              </Grid>

              <Grid item xs={2}>
                <Button 
                  variant="outlined" 
                  onClick={(event) => this.onAddDayHandler(event)}
                  className={classes.button}>
                    +1d
                </Button>
              </Grid>

            </Grid>
          </CardContent>
        </Card>
        <Switch>
          {/* <Route path={this.props.match.url + '/:date'} exact component={ProviderList} /> */}
          <Route path="/:date" component={ Child } />
        </Switch>
      </div>
    );
  }
}

RinexAvailability.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(RinexAvailability));
