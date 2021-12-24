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

  state = {
    dragMode: false,
    dates: []
  };

  // currentDate(date) {
  //   let formatedDate = helpers.convertDateToString(date);
  //   formatedDate = formatedDate.split('.').reverse().join('-');
  //   return formatedDate
  // }

  checkIsItPast = date => {
    date.setHours(0);
    const dateStamp = date.getTime();
    const todayStamp = TODAY.getTime() - DAY_TIME;

    return { past: dateStamp < todayStamp }
  };

  // convertDatesToArray = () => {
  //   const { tempDateInterval } = this.props;
  //
  //   let startStamp = helpers.getDateFromString(tempDateInterval.startDate);
  //   let endStamp = helpers.getDateFromString(tempDateInterval.endDate);
  //
  //   let current = startStamp;
  //
  //   let dates = [tempDateInterval.startDate];
  //   let datePairs = [];
  //
  //   while (current < endStamp) {
  //     current += DAY_TIME;
  //     dates.push(helpers.convertDateToString(new Date(current)))
  //   }
  //
  //   for (let i = 0, len = dates.length; i < len - 1; i++) {
  //     for (let j = i + 1; j < len; j++) {
  //       let diff = helpers.getDateFromString(dates[j]) - helpers.getDateFromString(dates[i]);
  //       if (diff === DAY_TIME * 7) {
  //         datePairs.push({ firstDate: dates[i], secondDate: dates[j] })
  //       }
  //     }
  //   }
  //
  //   this.setState({ dates: datePairs })
  // };

  getDaySettings = (date) => {
    const { past } = this.checkIsItPast(date);
    return {
      date,
      past
    };
  };

  getCustomProps = date => {
    const { customData = {}, customHandlers = [] } = this.props;
    let customProps = {};

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

  createRangeCalendar = (startDate, endDate) => {
    const { dayComponent, stylesFor } = this.props;
    const Day = dayComponent;
    let calendar = [];
    let startMonth = new Date(startDate);
    let endMonth = new Date(endDate);
    startMonth.setHours(0);
    endMonth.setHours(0);

    const rangeLength = ((endMonth.getTime() - startMonth.getTime()) / DAY_TIME) + 1;

    const startPos = 17 - Math.floor(rangeLength / 2);

    startMonth.setDate(startMonth.getDate() - startPos + startMonth.getDay());
    startMonth.setDate(startMonth.getDate() - startMonth.getDay());


    new Array(35).fill(null).forEach(() => {
      let currentY = startMonth.getFullYear();
      let currentM = startMonth.getMonth();
      let currentD = startMonth.getDate();

      let currentDate = new Date(currentY, currentM, currentD);

      calendar.push(
        <Day
          stylesFor={stylesFor}
          {...this.getDaySettings(currentDate)}
          {...this.getCustomProps(currentDate)}
          key={currentDate.getTime()} />
      );
      startMonth.setDate(startMonth.getDate() + 1);
    });

    return calendar
  };

  getCalendar = (year, month) => {
    return this.createCalendar(year, month)
  };

  render() {
    const { year, month, daysOfWeek, label, className, forYear, daysOfWeekClassName } = this.props;
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
