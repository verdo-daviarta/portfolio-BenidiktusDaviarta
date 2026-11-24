"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";

type ApiResult = {
  status: number;
  message: string;
};

const requestTabs = ["Body", "Headers"] as const;
const initialBody = '{\n  "visitor": "",\n  "id": ""\n}';

export function EntryApiTest({ destination }: { destination: string }) {
  const [body, setBody] = useState(initialBody);
  const [tab, setTab] = useState<(typeof requestTabs)[number]>("Body");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");
  const sending = useRef(false);
  const tabList = useRef<HTMLDivElement>(null);
  const lineNumbers = useRef<HTMLPreElement>(null);

  function clearResponse() {
    setResult(null);
    setError("");
  }

  function moveTab(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 1
          : tab === "Body"
            ? 1
            : 0;
    setTab(requestTabs[index]);
    tabList.current?.querySelectorAll("button")[index]?.focus();
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setPending(true);
    clearResponse();
    try {
      const response = await fetch("/api/entry-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = await response.json();
      if (typeof data.message !== "string")
        throw new Error("Unexpected response");
      setResult({ status: response.status, message: data.message });
    } catch {
      setError(
        "The request could not be completed. Check your connection and send it again.",
      );
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  return (
    <div className="entry-test">
      <header className="entry-test-heading">
        {/* <p className="entry-breadcrumb">Portfolio / API test</p> */}
        <h1>Let&apos;s start with an API test.</h1>
        <p>
          Fill in the JSON body using the documentation below. Get a{" "}
          <strong>200 OK</strong> response to enter{" "}
          <strong>my portfolio</strong>.
        </p>
      </header>

      <div className="entry-workbench">
        <div className="entry-workbench-heading">
          <h2 id="request-heading">Portfolio entry</h2>
          <span>HTTP request</span>
        </div>

        <form
          onSubmit={send}
          aria-labelledby="request-heading"
          aria-busy={pending}
        >
          <div className="entry-request-bar">
            <div className="entry-endpoint" aria-label="Request endpoint">
              <span className="entry-method">POST</span>
              <code>/api/entry-test</code>
            </div>
            <button className="entry-send" type="submit" disabled={pending}>
              {pending ? "Sending..." : "Send"}
            </button>
          </div>

          <div className="entry-panes">
            <section
              className="entry-request"
              aria-label="Request configuration"
            >
              <div
                className="entry-tabs"
                role="tablist"
                aria-label="Request settings"
                ref={tabList}
              >
                {requestTabs.map((name) => (
                  <button
                    key={name}
                    id={`request-tab-${name.toLowerCase()}`}
                    type="button"
                    role="tab"
                    aria-selected={tab === name}
                    aria-controls={`request-panel-${name.toLowerCase()}`}
                    tabIndex={tab === name ? 0 : -1}
                    onClick={() => setTab(name)}
                    onKeyDown={moveTab}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div
                id="request-panel-body"
                role="tabpanel"
                aria-labelledby="request-tab-body"
                hidden={tab !== "Body"}
              >
                <div className="entry-editor-toolbar">
                  <label htmlFor="request-body">Request body</label>
                  <span>
                    raw <span aria-hidden="true">/</span> <strong>JSON</strong>
                  </span>
                </div>
                <div className="entry-json-editor">
                  <pre
                    className="entry-line-numbers"
                    aria-hidden="true"
                    ref={lineNumbers}
                  >
                    {body
                      .split("\n")
                      .map((_, index) => index + 1)
                      .join("\n")}
                  </pre>
                  <textarea
                    id="request-body"
                    name="body"
                    value={body}
                    onChange={(event) => {
                      setBody(event.target.value);
                      clearResponse();
                    }}
                    disabled={pending}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    wrap="off"
                    onScroll={(event) => {
                      if (lineNumbers.current)
                        lineNumbers.current.scrollTop =
                          event.currentTarget.scrollTop;
                    }}
                    aria-describedby="entry-documentation"
                  />
                </div>
              </div>

              <div
                id="request-panel-headers"
                role="tabpanel"
                aria-labelledby="request-tab-headers"
                hidden={tab !== "Headers"}
                tabIndex={0}
              >
                <table className="entry-headers-table">
                  <caption>Headers sent with this request</caption>
                  <thead>
                    <tr>
                      <th scope="col">Key</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Content-Type</td>
                      <td>application/json</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section
              className="entry-response"
              aria-labelledby="response-heading"
            >
              <div className="entry-response-heading">
                <h2 id="response-heading">Response</h2>
                <span>JSON</span>
              </div>
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="entry-response-content"
              >
                {pending ? (
                  <p className="entry-response-empty">
                    Sending POST request...
                  </p>
                ) : result ? (
                  <>
                    <p
                      className={
                        result.status === 200 ? "entry-success" : "entry-error"
                      }
                    >
                      {result.status === 200
                        ? "200 OK"
                        : `${result.status} Bad Request`}
                    </p>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  </>
                ) : error ? (
                  <p className="entry-error">{error}</p>
                ) : (
                  <p className="entry-response-empty">
                    Send the request to see its status and JSON response.
                  </p>
                )}
              </div>
              {result?.status === 200 && (
                <div className="entry-continue">
                  <Link
                    href={destination}
                    transitionTypes={["portfolio-enter"]}
                    className="entry-enter"
                  >
                    Enter portfolio
                  </Link>
                </div>
              )}
            </section>
          </div>
        </form>
      </div>

      <section
        className="entry-documentation"
        id="entry-documentation"
        aria-labelledby="documentation-heading"
      >
        <div>
          <h2 id="documentation-heading">Request documentation</h2>
          <p>
            Use these exact string values.
          </p>
          <p>
            A correct body returns <strong>200 OK</strong>. Invalid JSON,
            missing fields, or incorrect values return{" "}
            <strong>400 Bad Request</strong>.
          </p>
        </div>
        <table className="entry-values-table">
          <caption className="sr-only">Required request body values</caption>
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Type</th>
              <th scope="col">Required value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <code>visitor</code>
              </th>
              <td>string</td>
              <td>
                <code>&quot;guest&quot;</code>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <code>id</code>
              </th>
              <td>string</td>
              <td>
                <code>&quot;001&quot;</code>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <form className="entry-skip" action="/api/entry-test/skip" method="post">
        <p id="entry-skip-description">
          If you&apos;re unfamiliar with API testing or don&apos;t have a
          testing background, you can skip this test and go straight to my
          portfolio.
        </p>
        <input type="hidden" name="destination" value={destination} />
        <button
          type="submit"
          className="entry-skip-button"
          aria-describedby="entry-skip-description"
        >
          Skip test
        </button>
      </form>
    </div>
  );
}
