import winston, { Logger, LeveledLogMethod,  } from 'winston';
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
		rest: 7,
		gateway: 8,
	},
	colors: {
		graphql: 'magenta',
		rest: 'cyan',
		gateway: 'grey',
	}
};

interface MyLogger extends Logger {
    readonly graphql: LeveledLogMethod;
	readonly rest: LeveledLogMethod;
	readonly gateway: LeveledLogMethod;
}

winston.addColors(config.colors);

winston.loggers.add('default', {
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
					if(details && typeof details === 'object') details = JSON.stringify(details);

					return `${timestamp} ${level}  ${process.pid} --- ${label ? `[${chalk.cyan(label)}]:` : ''} ${message}${details ? `\n${details}` : ''}`;
				}),
			)
		}),
		new winston.transports.File({ 
			filename: `logs/combined_${new Date().toISOString()}-${process.pid}.log`,
			format: combine(
				printf(({ level, message, label, timestamp = new Date().toISOString(), details }) => {
					if(details && typeof details === 'object') details = JSON.stringify(details);
					
					return `${timestamp} ${level}  ${process.pid} --- ${label ? `[${label}]:` : ''} ${message}${details ? `\n${details}` : ''}`;
				}),
			)
		}),
	],
	exitOnError: false,
});

const logger = winston.loggers.get('default') as MyLogger;

logger.child = function () { return winston.loggers.get('default') as MyLogger; };

Object.defineProperty(global, 'logger', {
	value: logger,
});