export const addScript = (link) => {
    const script = document.createElement("script");
    script.src = link;
    script.async = true;
    document.head.appendChild(script);
};

export const addLink = (ref) => {
  const link = document.createElement('link');
  link.href = ref;
  lnk.async = true;
  document.head.appendChild(link);
}
