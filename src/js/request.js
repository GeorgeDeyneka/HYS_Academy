export async function makeRequest(path = 1) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${path}/photos`
    );
    const result = await response.json();

    return result.slice(0, 9);
  } catch (err) {
    console.log(err);
  }
}
