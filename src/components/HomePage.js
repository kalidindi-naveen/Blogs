import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import Code from "./Code";

const HomePage = () => {
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    import("../markdown/home.md").then((res) => {
      fetch(res.default)
        .then((response) => response.text())
        .then((response) => setPostContent(response))
        .catch((err) => console.log(err));
    });
  }, []);

  return (
    <article className="article">
      <div className="container">
        <div className="post-wrapper">
          <Markdown
            options={{
              overrides: {
                Code: {
                  component: Code,
                },
              },
            }}
          >
            {postContent}
          </Markdown>
        </div>
      </div>
    </article>
  );
};

export default HomePage;
