/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import Code from "./Code";

function DetailPage() {
    let { id } = useParams();
    const [postContent, setPostContent] = useState("");

    useEffect(() => {
        try {
            import(`../../Notes/kubernetes/ckaday${id}.md`).then(
                (res) => {
                    fetch(res.default)
                        .then((response) => response.text())
                        .then((response) => setPostContent(response));
                }
            );
        } catch (error) {
            console.log(error);
            setPostContent("Error");
        }
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
}

export default DetailPage;
