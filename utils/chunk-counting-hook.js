import { PassThrough } from 'stream';
import 'colors';

export default function createChunkCountMonitor(label, logIntervalInSeconds){
    let items = 0;
    let monitorStream = new PassThrough({ objectMode: true })
    
    const interval = setInterval(() => console.log(`${label}: ${items} Items Passed`.blue), logIntervalInSeconds*1000)
    
    const dataHandler = () => items++;
    monitorStream.on('data', dataHandler);

    monitorStream.once('finish', () => {
        console.log(`${label}: ${items} Items Passed (Done!)`.bgGreen);
        monitorStream.off('data', dataHandler);
        interval.close();
    });

    return monitorStream;
}