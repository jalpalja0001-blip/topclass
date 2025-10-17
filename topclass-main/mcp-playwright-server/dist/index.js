#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const playwright_1 = require("playwright");
class PlaywrightMCPServer {
    server;
    state = { browserType: 'chromium' };
    constructor() {
        this.server = new index_js_1.Server({
            name: 'playwright-server',
            version: '0.1.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        this.setupErrorHandling();
    }
    setupErrorHandling() {
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.cleanup();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'launch_browser',
                    description: '브라우저를 시작합니다 (chromium, firefox, webkit 지원)',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            browserType: {
                                type: 'string',
                                enum: ['chromium', 'firefox', 'webkit'],
                                default: 'chromium',
                                description: '사용할 브라우저 타입'
                            },
                            headless: {
                                type: 'boolean',
                                default: true,
                                description: '헤드리스 모드 여부'
                            }
                        }
                    }
                },
                {
                    name: 'navigate_to',
                    description: '지정된 URL로 이동합니다',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string',
                                description: '이동할 URL'
                            }
                        },
                        required: ['url']
                    }
                },
                {
                    name: 'take_screenshot',
                    description: '현재 페이지의 스크린샷을 촬영합니다',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: {
                                type: 'string',
                                description: '스크린샷 저장 경로'
                            },
                            fullPage: {
                                type: 'boolean',
                                default: false,
                                description: '전체 페이지 캡처 여부'
                            }
                        }
                    }
                },
                {
                    name: 'click_element',
                    description: '요소를 클릭합니다',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            selector: {
                                type: 'string',
                                description: '클릭할 요소의 CSS 선택자'
                            }
                        },
                        required: ['selector']
                    }
                },
                {
                    name: 'fill_input',
                    description: '입력 필드에 텍스트를 입력합니다',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            selector: {
                                type: 'string',
                                description: '입력 필드의 CSS 선택자'
                            },
                            text: {
                                type: 'string',
                                description: '입력할 텍스트'
                            }
                        },
                        required: ['selector', 'text']
                    }
                },
                {
                    name: 'get_text',
                    description: '요소의 텍스트를 가져옵니다',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            selector: {
                                type: 'string',
                                description: '텍스트를 가져올 요소의 CSS 선택자'
                            }
                        },
                        required: ['selector']
                    }
                },
                {
                    name: 'wait_for_element',
                    description: '요소가 나타날 때까지 대기합니다',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            selector: {
                                type: 'string',
                                description: '대기할 요소의 CSS 선택자'
                            },
                            timeout: {
                                type: 'number',
                                default: 30000,
                                description: '대기 시간 (밀리초)'
                            }
                        },
                        required: ['selector']
                    }
                },
                {
                    name: 'run_test',
                    description: 'Playwright 테스트를 실행합니다',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            testFile: {
                                type: 'string',
                                description: '실행할 테스트 파일 경로'
                            },
                            grep: {
                                type: 'string',
                                description: '실행할 테스트 패턴'
                            }
                        }
                    }
                },
                {
                    name: 'close_browser',
                    description: '브라우저를 닫습니다',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                }
            ]
        }));
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'launch_browser':
                        return await this.launchBrowser(args);
                    case 'navigate_to':
                        return await this.navigateTo(args);
                    case 'take_screenshot':
                        return await this.takeScreenshot(args);
                    case 'click_element':
                        return await this.clickElement(args);
                    case 'fill_input':
                        return await this.fillInput(args);
                    case 'get_text':
                        return await this.getText(args);
                    case 'wait_for_element':
                        return await this.waitForElement(args);
                    case 'run_test':
                        return await this.runTest(args);
                    case 'close_browser':
                        return await this.closeBrowser();
                    default:
                        throw new Error(`알 수 없는 도구: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `오류 발생: ${error instanceof Error ? error.message : String(error)}`
                        }
                    ]
                };
            }
        });
    }
    async launchBrowser(args) {
        const { browserType = 'chromium', headless = true } = args;
        if (this.state.browser) {
            await this.state.browser.close();
        }
        this.state.browserType = browserType;
        const browserEngine = browserType === 'chromium' ? playwright_1.chromium :
            browserType === 'firefox' ? playwright_1.firefox : playwright_1.webkit;
        this.state.browser = await browserEngine.launch({ headless });
        this.state.page = await this.state.browser.newPage();
        return {
            content: [
                {
                    type: 'text',
                    text: `${browserType} 브라우저가 성공적으로 시작되었습니다 (headless: ${headless})`
                }
            ]
        };
    }
    async navigateTo(args) {
        if (!this.state.page) {
            throw new Error('브라우저가 시작되지 않았습니다. 먼저 launch_browser를 사용하세요.');
        }
        await this.state.page.goto(args.url);
        return {
            content: [
                {
                    type: 'text',
                    text: `${args.url}로 이동했습니다`
                }
            ]
        };
    }
    async takeScreenshot(args) {
        if (!this.state.page) {
            throw new Error('브라우저가 시작되지 않았습니다.');
        }
        const path = args.path || `screenshot-${Date.now()}.png`;
        await this.state.page.screenshot({ path, fullPage: args.fullPage });
        return {
            content: [
                {
                    type: 'text',
                    text: `스크린샷이 ${path}에 저장되었습니다`
                }
            ]
        };
    }
    async clickElement(args) {
        if (!this.state.page) {
            throw new Error('브라우저가 시작되지 않았습니다.');
        }
        await this.state.page.click(args.selector);
        return {
            content: [
                {
                    type: 'text',
                    text: `요소 "${args.selector}"를 클릭했습니다`
                }
            ]
        };
    }
    async fillInput(args) {
        if (!this.state.page) {
            throw new Error('브라우저가 시작되지 않았습니다.');
        }
        await this.state.page.fill(args.selector, args.text);
        return {
            content: [
                {
                    type: 'text',
                    text: `입력 필드 "${args.selector}"에 "${args.text}"를 입력했습니다`
                }
            ]
        };
    }
    async getText(args) {
        if (!this.state.page) {
            throw new Error('브라우저가 시작되지 않았습니다.');
        }
        const text = await this.state.page.textContent(args.selector);
        return {
            content: [
                {
                    type: 'text',
                    text: `요소 "${args.selector}"의 텍스트: ${text || '(텍스트 없음)'}`
                }
            ]
        };
    }
    async waitForElement(args) {
        if (!this.state.page) {
            throw new Error('브라우저가 시작되지 않았습니다.');
        }
        await this.state.page.waitForSelector(args.selector, { timeout: args.timeout });
        return {
            content: [
                {
                    type: 'text',
                    text: `요소 "${args.selector}"가 나타났습니다`
                }
            ]
        };
    }
    async runTest(args) {
        const { spawn } = require('child_process');
        return new Promise((resolve) => {
            const cmd = 'npx';
            const cmdArgs = ['playwright', 'test'];
            if (args.testFile) {
                cmdArgs.push(args.testFile);
            }
            if (args.grep) {
                cmdArgs.push('--grep', args.grep);
            }
            const child = spawn(cmd, cmdArgs, {
                stdio: 'pipe',
                shell: true,
                cwd: process.cwd()
            });
            let output = '';
            let errorOutput = '';
            child.stdout?.on('data', (data) => {
                output += data.toString();
            });
            child.stderr?.on('data', (data) => {
                errorOutput += data.toString();
            });
            child.on('close', (code) => {
                resolve({
                    content: [
                        {
                            type: 'text',
                            text: `테스트 실행 완료 (종료 코드: ${code})\n\n출력:\n${output}\n\n에러:\n${errorOutput}`
                        }
                    ]
                });
            });
        });
    }
    async closeBrowser() {
        if (this.state.browser) {
            await this.state.browser.close();
            this.state.browser = undefined;
            this.state.page = undefined;
        }
        return {
            content: [
                {
                    type: 'text',
                    text: '브라우저가 닫혔습니다'
                }
            ]
        };
    }
    async cleanup() {
        if (this.state.browser) {
            await this.state.browser.close();
        }
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error('Playwright MCP 서버가 시작되었습니다');
    }
}
const server = new PlaywrightMCPServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map