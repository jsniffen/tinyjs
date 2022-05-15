const path = window.location.pathname.split("/");
const selectedThread = state(null)
console.log(path);
if (path[1] === "thread" && path[2]) {
  selectedThread.set(path[2]);
}

const threads = state([]);

const fetchThreads = async () => {
  try {
    threads.set(await getThreads());
  } catch (err) {
    console.log(err);
  }
}

fetchThreads();
