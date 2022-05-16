const url = "http://api.threaditjs.com";

export const getThreads = async () => {
  const resp = await fetch(`${url}/threads`);
  const json = await resp.json();
  return json.data;
};

export const getComments = async (id) => {
  const resp = await fetch(`${url}/comments/${id}`);
  const json = await resp.json();
  return json.data;
};

export const createThread = async (text) => {
  const resp = await fetch(`${url}/threads/create`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({text: text}),
  });

  const json = await resp.json();
  return json.data;
};

export const createComment = async (parent, text) => {
  const resp = await fetch(`${url}/comments/create`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({parent: parent, text: text}),
  });

  const json = await resp.json();
  return json.data;
};
