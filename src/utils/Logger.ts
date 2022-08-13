import winston, { Logger, LeveledLogMethod } from 'winston';
import chalk from 'chalk';

const { printf, combine, timestamp, colorize } = winston.format; 

const config = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		http: 3,
		debug: 5,
		graphql: 6,
	},
	colors: {
		graphql: 'magenta',
	}
};

interface MyLogger extends Logger {
    readonly graphql: LeveledLogMethod;
}

winston.addColors(config.colors);

// @ts-ignore
const logger: MyLogger = winston.createLogger({
	format: combine(
		winston.format.simple(),
		timestamp(),
	),
	levels: config.levels,
	level: 'info',
	transports: [
		new winston.transports.Console({
			format: combine(
				colorize({ level: true }),
				printf(({ level, message, label, timestamp = new Date().toISOString(), details }) => {
					return `${timestamp} ${level}  ${process.pid} --- ${label ? `[${chalk.cyan(label)}]:` : ''} ${message}${details ? `\n${details}` : ''}`;
				}),
			)
		}),
		new winston.transports.File({ 
			filename: `logs/combined_${new Date().toISOString()}-${process.pid}.log`,
			format: combine(
				printf(({ level, message, label, timestamp = new Date().toISOString(), details }) => {
					return `${timestamp} ${level}  ${process.pid} --- ${label ? `[${label}]:` : ''} ${message}${details ? `\n${details}` : ''}`;
				}),
			)
		}),
	],
	exitOnError: false,
});

Object.defineProperty(global, 'logger', {
	value: logger,
});