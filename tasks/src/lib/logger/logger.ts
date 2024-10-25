type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
  requestId?: string;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private isProd = process.env.NODE_ENV === 'production';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      error: entry.error ? {
        message: entry.error.message,
        stack: entry.error.stack,
        name: entry.error.name,
        ...(entry.error instanceof Error && (entry.error as any).code && {
          code: (entry.error as any).code
        }),
        ...(entry.error instanceof Error && (entry.error as any).statusCode && {
          statusCode: (entry.error as any).statusCode
        })
      } : undefined,
      context: entry.context ? this.sanitizeContext(entry.context) : undefined
    }, null, this.isProd ? 0 : 2);
  }

  private sanitizeContext(context: any): any {
    // Remove sensitive information
    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private getConsoleColor(level: LogLevel): string {
    const colors = {
      info: '\x1b[36m',  // cyan
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m', // red
      debug: '\x1b[35m'  // magenta
    };
    return colors[level];
  }

  private async saveLog(entry: LogEntry) {
    if (this.isProd) {
      // In production, you might want to send logs to a service
      // Example: await fetch('your-logging-service', { method: 'POST', body: JSON.stringify(entry) });
      
      // For now, just use console.log
      console.log(this.formatLog(entry));
    } else {
      // In development, use colored console logs
      const color = this.getConsoleColor(entry.level);
      console.log(
        `${color}[${entry.level.toUpperCase()}]\x1b[0m`,
        `[${entry.timestamp}]`,
        entry.message,
        entry.context ? `\nContext: ${JSON.stringify(entry.context, null, 2)}` : '',
        entry.error ? `\nError: ${entry.error.message}\nStack: ${entry.error.stack}` : ''
      );
    }
  }

  log(
    level: LogLevel,
    message: string,
    context?: any,
    error?: Error,
    userId?: string,
    requestId?: string
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId,
      requestId,
      error
    };

    this.saveLog(entry).catch(err => {
      console.error('Failed to save log:', err);
    });
  }

  info(message: string, context?: any, userId?: string, requestId?: string) {
    this.log('info', message, context, undefined, userId, requestId);
  }

  warn(message: string, context?: any, userId?: string, requestId?: string) {
    this.log('warn', message, context, undefined, userId, requestId);
  }

  error(error: Error, context?: any, userId?: string, requestId?: string) {
    this.log('error', error.message, context, error, userId, requestId);
  }

  debug(message: string, context?: any, userId?: string, requestId?: string) {
    if (!this.isProd) {
      this.log('debug', message, context, undefined, userId, requestId);
    }
  }

  // Helper method for API routes
  logRequest(req: Request, context?: any) {
    this.debug(`${req.method} ${req.url}`, {
      ...context,
      headers: Object.fromEntries(req.headers.entries())
    });
  }
}

export const logger = Logger.getInstance();
