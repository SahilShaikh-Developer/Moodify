const history = [];

export function smoothEmotion(emotion) {
  history.push(emotion);

  if (history.length > 10)
    history.shift();

  const count = {};

  history.forEach(e => {
    count[e] = (count[e] || 0) + 1;
  });

  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])[0][0];
}