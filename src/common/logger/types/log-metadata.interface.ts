import { LogLevelEnum } from '@/common/logger/enums/log-level.enum';

export interface LogDetails {
  identifier?: string; // Unique identifier related to the log, such as userId or transactionId
  method?: string; // Method or function name where the log was generated
  payload?: Record<string, any>; // Data associated with the log, such as inputs or responses
  [key: string]: any; // Allows additional fields to maintain flexibility in logging details
}

/**
 * LogMetadata defines the standard structure for log entries.
 *
 * - index: The log index name (e.g., "auth-discord").
 * - context: The context or source of the log, usually the class or service emitting the log.
 * - action: The specific action performed that the log represents.
 * - details: Additional details about the log, including standard fields and flexibility for custom data.
 * - error: Specific error information, populated if the log level is ERROR.
 * - level: The log level indicating the severity (info, error, etc.).
 * - environment: The application environment (development, production, etc.). Automatically populated.
 * - nodeName: The node or host name where the log is generated. Automatically populated.
 * - timestamp: The optional timestamp of when the log was generated. Automatically populated.
 */
export interface LogMetadata {
  index: string;
  context?: string;
  action?: string;
  details?: LogDetails;
  error?: {
    message: string;
    stack?: string;
    code?: string;
    name?: string;
  };
  level?: LogLevelEnum;
  environment?: string;
  nodeName?: string;
  timestamp?: string;
  [key: string]: any;
}
