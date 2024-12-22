import { ResponseStatuses, UDP } from "./baseServer";
import { messages } from "./types";

enum SessionStatus {
    open = "opened",
    closed = "closed"
}

let session = SessionStatus.closed

function startSession() {
   session = SessionStatus.open 
}
function endSession() {
    session  = SessionStatus.closed
}


function getSessionStatus(): SessionStatus {
    return session
}


new UDP()
  .addHandler<{}>(messages.end_session.toString(), async (payload: {}) => {
      endSession();
  return {status: ResponseStatuses.Successful, payload: {}}
  })
  .addHandler<{}>(messages.start_session.toString(), async (payload: {}) => {
      startSession();
      return {status: ResponseStatuses.Successful, payload: {}}
  })
  .addHandler<{}>(messages.get_session_statues.toString(), async (payload: {}) => {
      return {status: ResponseStatuses.Successful, payload: getSessionStatus()}
  })
  .listen(41234);