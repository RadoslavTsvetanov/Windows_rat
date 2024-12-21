import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import { Queue } from "./queue";

const app = express();
const PORT = 3000;



// Middleware
app.use(bodyParser.json());

// Temporary storage for requests

type queueItem = string

const items = new Queue<queueItem>()


type expressResponse<T> = {errorMsg: string} | T

app.get("/next", (req: Request, res: Response<expressResponse<{item: queueItem}>>) => {
    try {
    const nextItem = items.get();
        res.status(201).json({ item: nextItem });
     } catch (err) {
        res.status(404).json({ errorMsg : err.message });
    }
});

app.post("/next", (req: Request<{}, {}, { next: queueItem }>, res: Response<expressResponse<{}>>) => {
  const { next } = req.body;

    try {
        items.add(next);
        res.status(201).json({})
  } catch(err) {
    res.status(400).json({ errorMsg : err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
