// const HOST = 'http://localhost:3001' // Mock 的 host
const HOST = "http://localhost:3005"; // real 的 host

export async function get(url: string) {
  const res = await fetch(`${HOST}${url}`);
  const data = res.json();
  return data;
}

export async function post(url: string, body: any) {
  const res = await fetch(`${HOST}${url}`, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = res.json();
  return data;
}
