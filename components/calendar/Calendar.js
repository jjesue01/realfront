import React, { Component } from 'react';
import styles from './Calendar.module.sass'
import classNames from 'classnames';

const monthsFull = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const DAY_TIME = 86400000;
const TODAY = new Date();
TODAY.setHours(0);

class Calendar extends Component {

  // static propTypes = {
  //   year: PropTypes.number,
  //   month: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  //   calendarData: PropTypes.object,
  //   tempDateInterval: PropTypes.object,
  //   dayComponent: PropTypes.object.isRequired,
  //   label: PropTypes.bool,
  //   labelSize: PropTypes.oneOf(['default', 'small']),
  //   daysOfWeek: PropTypes.bool,
  //   withNeighbors: PropTypes.bool,
  //   callback: PropTypes.func,
  //   bookingParams: PropTypes.object,
  //   type: PropTypes.oneOf(['multi', 'default']),
  //   forYear: PropTypes.bool
  // };

  static defaultProps = {
    calendarData: {},
    label: false,
    daysOfWeek: false,
    withNeighbors: false,
    labelSize: 'default',
    callback: () => { },
    bookingParams: {},
    type: 'default',
    forYear: false
  };

  checkIsItPast = date => {
    date.setHours(0);
    const dateStamp = date.getTime();
    const todayStamp = TODAY.getTime() - DAY_TIME;

    return { past: dateStamp < todayStamp }
  };

  getDaySettings = (date) => {
    const { past } = this.checkIsItPast(date);
    return {
      date,
      past
    };
  };

  getCustomProps = date => {
    const { customData = {}, customHandlers = [] } = this.props;
    let customProps = { ...customData };

    customHandlers.forEach(handler => {
      customProps = {
        ...customProps,
        ...customData,
        ...handler(date, customData)
      }
    });

    return customProps
  };

  createCalendar = (year, month) => {
    const { dayComponent, withNeighbors, type = 'default', stylesFor } = this.props;
    const Day = dayComponent;
    let calendar = [];

    let mon = month - 1;
    let currentMonth = new Date(year, mon);
    let pastMonth = new Date(year, mon);
    let futureMonth = new Date(year, mon + 1);

    pastMonth.setDate(pastMonth.getDate() - currentMonth.getDay() - 1);

    if (type !== 'multi') {
      for (let i = 0; i < currentMonth.getDay(); i++) {
        pastMonth.setDate(pastMonth.getDate() + 1);

        let pastY = pastMonth.getFullYear();
        let pastM = pastMonth.getMonth();
        let pastD = pastMonth.getDate();

        let pastDate = new Date(pastY, pastM, pastD);

        if (withNeighbors) {
          calendar.push(
            <Day
              {...this.getDaySettings(pastDate)}
              {...this.getCustomProps(pastDate)}
              inactiveMonth
              key={pastMonth.getTime()}
              stylesFor={stylesFor} />
          )
        } else {
          calendar.push(
            <div key={pastMonth.getTime()} />
          )
        }
      }
    }

    while (currentMonth.getMonth() === mon) {
      let currentY = currentMonth.getFullYear();
      let currentM = currentMonth.getMonth();
      let currentD = currentMonth.getDate();

      let currentDate = new Date(currentY, currentM, currentD);

      calendar.push(
        <Day
          {...this.getDaySettings(currentDate)}
          {...this.getCustomProps(currentDate)}
          key={currentMonth.getTime()}
          stylesFor={stylesFor} />
      );
      currentMonth.setDate(currentMonth.getDate() + 1);
    }

    if (currentMonth.getDay() !== 0 && type !== 'multi') {
      for (let i = currentMonth.getDay(); i < 7; i++) {
        let futureY = futureMonth.getFullYear();
        let futureM = futureMonth.getMonth();
        let futureD = futureMonth.getDate();

        let futureDate = new Date(futureY, futureM, futureD);

        if (withNeighbors) {
          calendar.push(
            <Day
              {...this.getDaySettings(futureDate)}
              {...this.getCustomProps(futureDate)}
              inactiveMonth
              key={futureMonth.getTime()}
              stylesFor={stylesFor} />
          );
        } else {
          calendar.push(
            <div key={futureMonth.getTime()} />
          );
        }


        futureMonth.setDate(futureMonth.getDate() + 1)
      }
    }

    if (withNeighbors) calendar.length = 35;

    return calendar
  };

  getCalendar = (year, month) => {
    return this.createCalendar(year, month)
  };

  render() {
    const { year, month, daysOfWeek, className, daysOfWeekClassName } = this.props;
    const weekDays = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ]

    return (
      <div className={styles.root}>
        { daysOfWeek &&
        <div className={classNames(daysOfWeekClassName, styles.daysOfWeek)}>
          {
            weekDays.map(day =>
              <div key={day} className={styles.dayOfWeek}>
                <span>
                  {day}
                </span>
              </div>)
          }
        </div>
        }
        <div className={classNames(styles.calendar, className)}>
          {this.getCalendar(year, month)}
        </div>
      </div>
    )
  }
}

export default Calendar
