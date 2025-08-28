import morgan from "morgan";
import logger from "./logger.js";

// Create a stream object with a 'write' function that will be used by Morgan
const stream = {
    write: (message) => {
        // Remove the newline character from the end of the message
        const logMessage = message.trim();
        
        // Parse the morgan log format
        const logObject = {
            method: logMessage.split(" ")[0],
            url: logMessage.split(" ")[1],
            status: logMessage.split(" ")[2],
            responseTime: logMessage.split(" ")[3],
            timestamp: new Date().toISOString()
        };
        
        // Log to winston
        logger.info("HTTP Request", logObject);
    }
};

// Create the morgan middleware
const morganLogger = morgan(
    ":method :url :status :response-time ms",
    { stream }
);

export default morganLogger; 