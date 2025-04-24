// Code Assistant Overlay - Content Script
// This script runs on coding websites to detect code blocks and create the overlay

// Configuration
const CONFIG = {
    buttonSize: '40px',
    buttonColor: '#4CAF50',
    buttonPosition: 'fixed',
    buttonRight: '20px',
    buttonBottom: '20px',
    zIndex: 2147483647 // Maximum safe z-index value
};

// Debug function
function debug(message) {
    console.log('[Code Assistant]', message);
}

// Create and inject the overlay button
function createOverlayButton() {
    debug('Creating overlay button...');
    
    try {
        // Remove existing button if it exists
        const existingButton = document.getElementById('code-assistant-button');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('div');
        button.id = 'code-assistant-button';
        button.textContent = '💡'; // Using textContent instead of innerHTML for security
        
        // Apply styles directly to ensure they're not overridden
        Object.assign(button.style, {
            width: CONFIG.buttonSize,
            height: CONFIG.buttonSize,
            backgroundColor: CONFIG.buttonColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: CONFIG.buttonPosition,
            right: CONFIG.buttonRight,
            bottom: CONFIG.buttonBottom,
            zIndex: CONFIG.zIndex,
            color: 'white',
            fontSize: '20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
            userSelect: 'none',
            margin: '0',
            padding: '0',
            border: 'none',
            outline: 'none'
        });

        // Add hover effect
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });

        // Add click handler
        button.addEventListener('click', toggleOverlay);

        // Append to document.documentElement (html) instead of body
        document.documentElement.appendChild(button);
        debug('Overlay button created successfully');
    } catch (error) {
        debug('Error creating overlay button: ' + error.message);
    }
}

// Create the overlay panel
function createOverlayPanel() {
    debug('Creating overlay panel...');
    
    try {
        // Remove existing panel if it exists
        const existingPanel = document.getElementById('code-assistant-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'code-assistant-panel';

        // Glass morphism styles (transparent blur, neon accents)
        Object.assign(panel.style, {
            position: CONFIG.buttonPosition,
            right: '20px',
            bottom: '70px',
            width: '380px',
            background: 'rgba(32, 32, 45, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            padding: '0',
            zIndex: CONFIG.zIndex,
            display: 'none',
            overflow: 'hidden',
            fontFamily: "'Inter', -apple-system, sans-serif",
            color: '#ffffff'
        });
        

        panel.innerHTML = `
            <div style="
                background: linear-gradient(90deg, rgba(76,175,80,0.15) 0%, rgba(32,32,45,0) 100%);
                padding: 18px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${chrome.runtime.getURL('icon.png')}" alt="XPLINA Icon" style="width: 40px; height: 40px; object-fit: contain;">
                    <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #fff;">XPLINA</h2>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="toggle-view" style="
                        background: rgba(76, 175, 80, 0.2);
                        color:rgb(238, 238, 238);
                        border: 1px solid rgba(76, 175, 80, 0.3);
                        border-radius: 8px;
                        padding: 6px 12px;
                        font-size: 12px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s;
                        backdrop-filter: blur(4px);
                    ">Show All Code</button>
                    <button id="settings-button" style="
                        background: rgba(76, 175, 80, 0.2);
                        color:rgb(238, 238, 238);
                        border: 1px solid rgba(76, 175, 80, 0.3);
                        border-radius: 6px;
                        width: 28px;
                        height: 28px;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s;
                        backdrop-filter: blur(4px);
                    ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77255 19.9887C9.57998 19.7201 9.31159 19.5179 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3643C3.80618 14.1866 3.49179 14.0913 3.17 14.09H3C2.46957 14.09 1.96086 13.8793 1.58579 13.5042C1.21071 13.1291 1 12.6204 1 12.09C1 11.5596 1.21071 11.0509 1.58579 10.6758C1.96086 10.3007 2.46957 10.09 3 10.09H3.09C3.42099 10.0823 3.74273 9.97512 4.01134 9.78255C4.27994 9.58998 4.48208 9.32159 4.59 9.01C4.72312 8.70838 4.76282 8.37381 4.704 8.04941C4.64519 7.72502 4.49054 7.42568 4.26 7.19L4.2 7.13C4.01405 6.94425 3.86653 6.72368 3.76588 6.48088C3.66523 6.23808 3.61343 5.97783 3.61343 5.715C3.61343 5.45217 3.66523 5.19192 3.76588 4.94912C3.86653 4.70632 4.01405 4.48575 4.2 4.3C4.38575 4.11405 4.60632 3.96653 4.84912 3.86588C5.09192 3.76523 5.35217 3.71343 5.615 3.71343C5.87783 3.71343 6.13808 3.76523 6.38088 3.86588C6.62368 3.96653 6.84425 4.11405 7.03 4.3L7.09 4.36C7.32568 4.59054 7.62502 4.74519 7.94941 4.804C8.27381 4.86282 8.60838 4.82312 8.91 4.69H9C9.29577 4.56324 9.54802 4.35276 9.72569 4.08447C9.90336 3.81618 9.99872 3.50179 10 3.18V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90336 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div id="settings-section" style="
                display: none;
                padding: 16px;
                background: rgba(25, 25, 40, 0.6);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            ">
                <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #fff;">API Settings</h3>
                <div style="margin-bottom: 12px;">
                    <input type="password" id="api-key-input" placeholder="Enter your Groq API key" style="
                        width: 84%;
                        padding: 8px 12px;
                        background: rgba(60, 55, 55, 0.49);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 6px;
                        color: #fff;
                        font-size: 13px;
                        outline: none;
                    ">
                </div>
                <button id="save-api-key" style="
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 16px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;
                ">Save API Key</button>
                <p id="api-key-status" style="
                    margin: 8px 0 0 0;
                    font-size: 12px;
                    color: #4CAF50;
                "></p>
            </div>

            <div id="code-display" style="
                background: rgba(25, 25, 40, 0.6);
                padding: 16px;
                max-height: 200px;
                overflow-y: auto;
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
                line-height: 1.6;
                white-space: pre-wrap;
                color: #e0e0ff;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                margin: 0;
            ">Click on any code block to analyze it</div>

            <div style="padding: 16px; position: relative;">
                <div style="position: relative;">
                    <textarea id="code-question" placeholder="Ask about this code..." style="
                        width: 84%;
                        height: 50px;
                        padding: 12px 42px 12px 12px;
                        background:rgba(60, 55, 55, 0.49);
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        color:rgb(237, 238, 241);
                        font-family: inherit;
                        font-size: 13px;
                        resize: none;
                        outline: none;
                        transition: border 0.2s;
                    "></textarea>
                    <button id="submit-question" style="
                        position: absolute;
                        right: 10px;
                        bottom: 10px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        width: 28px;
                        height: 28px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div id="response-area" style="
                padding: 16px;
                max-height: 250px;
                overflow-y: auto;
                background: rgba(25, 25, 40, 0.6);
                font-size: 14px;
                line-height: 1.6;
            "></div>
        `;

        // Append to document.documentElement (html) instead of body
        document.documentElement.appendChild(panel);
        debug('Overlay panel created successfully');

        // Add hover effects dynamically
        const toggleBtn = document.getElementById('toggle-view');
        const submitBtn = document.getElementById('submit-question');
        const textarea = document.getElementById('code-question');

        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.background = 'rgba(76, 175, 80, 0.3)';
            toggleBtn.style.border = '1px solid rgba(76, 175, 80, 0.5)';
        });
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.background = 'rgba(76, 175, 80, 0.2)';
            toggleBtn.style.border = '1px solid rgba(76, 175, 80, 0.3)';
        });

        submitBtn.addEventListener('mouseenter', () => {
            submitBtn.style.transform = 'translateY(-2px)';
            submitBtn.style.boxShadow = '0 4px 16px rgba(76, 175, 80, 0.4)';
        });
        submitBtn.addEventListener('mouseleave', () => {
            submitBtn.style.transform = 'translateY(0)';
            submitBtn.style.boxShadow = '0 2px 12px rgba(76, 175, 80, 0.3)';
        });

        textarea.addEventListener('focus', () => {
            textarea.style.border = '1px solid rgba(76, 175, 79, 0.59)';
        });
        textarea.addEventListener('blur', () => {
            textarea.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        });

        // Add event listener for the submit button
        document.getElementById('submit-question').addEventListener('click', handleQuestionSubmit);

        // Add event listener for the toggle view button
        document.getElementById('toggle-view').addEventListener('click', toggleCodeView);
    } catch (error) {
        debug('Error creating overlay panel: ' + error.message);
    }
}

// Toggle overlay visibility
function toggleOverlay() {
    const panel = document.getElementById('code-assistant-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    debug('Overlay toggled: ' + panel.style.display);
}

// Extract code from the page
function extractCode() {
    debug('Extracting code from page...');
    
    // More comprehensive selectors with GitHub-specific ones
    const CODE_SELECTORS = [
        // Rest of the selectors...
        '.react-code-view',
        '.ace_line',
        '.react-code-lines',
        'table[data-tagsearch-lang]',
        'div[data-tagsearch-lang]',
        'span[data-code-text]',
        '.blob-wrapper table',
        '.highlight table',
        '.markdown-body pre',
        '.js-file-line-container',
        '.blob-code-inner',
        '[data-snippet-clipboard-copy-content]',
        '.js-suggestion-code',
        'table.diff-table',
        '.markdown-body .highlight pre',
        'pre code',
        'pre.code',
        '.code-block',
        '.highlight',
        '.syntax-highlight',
        'code.hljs',
        '.CodeMirror-code',
        '.code-box-code'
    ];

    const selector = CODE_SELECTORS.join(', ');
    const codeBlocks = document.querySelectorAll(selector);
    
    // Remove any existing highlights
    document.querySelectorAll('.code-assistant-highlight').forEach(el => {
        el.classList.remove('code-assistant-highlight');
    });

    // Add hover effect and click handlers to code blocks
    codeBlocks.forEach(block => {
        if (!block.dataset.codeAssistantInitialized) {
            // Add hover styles
            block.addEventListener('mouseenter', () => {
                block.classList.add('code-assistant-highlight');
            });
            
            block.addEventListener('mouseleave', () => {
                if (!block.dataset.selected) {
                    block.classList.remove('code-assistant-highlight');
                }
            });

            // Add click handler
            block.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Remove previous selections
                document.querySelectorAll('[data-selected="true"]').forEach(el => {
                    el.dataset.selected = "false";
                    el.classList.remove('code-assistant-highlight');
                });

                // Select this block
                block.dataset.selected = "true";
                block.classList.add('code-assistant-highlight');

                // Get and clean the code
                let code = block.textContent || block.innerText;
                code = cleanCode(code);
                
                // Detect language
                let language = detectLanguage(block) || 'unknown';

                // Display the code in the panel
                const codeDisplay = document.getElementById('code-display');
                if (codeDisplay) {
                    codeDisplay.textContent = `Language: ${language}\n\n${code}`;
                }
            });

            block.dataset.codeAssistantInitialized = "true";
        }
    });

    // Return the selected code block's content if any, otherwise return all code blocks
    const selectedBlock = document.querySelector('[data-selected="true"]');
    if (selectedBlock) {
        const code = cleanCode(selectedBlock.textContent || selectedBlock.innerText);
        const language = detectLanguage(selectedBlock) || 'unknown';
        return `--- Selected Code (${language}) ---\n${code}`;
    }

    return 'Please click on a code block to analyze it.';
}

// Helper function to detect the programming language
function detectLanguage(element) {
    // Check element classes
    const classes = Array.from(element.classList || []);
    const parentClasses = Array.from(element.parentElement?.classList || []);
    
    // Common language class patterns
    const languagePatterns = {
        'javascript': /js|javascript|jsx|ts|typescript/i,
        'python': /python|py/i,
        'java': /\bjava\b/i,
        'cpp': /cpp|c\+\+/i,
        'csharp': /cs|csharp|c#/i,
        'php': /\bphp\b/i,
        'ruby': /\bruby\b|rb/i,
        'html': /\bhtml\b/i,
        'css': /\bcss\b/i,
        'sql': /\bsql\b/i
    };

    // Check both element and parent classes
    const allClasses = [...classes, ...parentClasses].join(' ').toLowerCase();
    
    for (const [language, pattern] of Object.entries(languagePatterns)) {
        if (pattern.test(allClasses)) {
            return language;
        }
    }

    // Check for language attribute
    const langAttr = element.getAttribute('lang') || 
                    element.getAttribute('data-lang') || 
                    element.getAttribute('data-language');
    
    if (langAttr) {
        return langAttr.toLowerCase();
    }

    return null;
}

// Helper function to clean up extracted code
function cleanCode(code) {
    return code
        .replace(/^\s+|\s+$/g, '')           // Trim whitespace
        .replace(/\t/g, '    ')              // Convert tabs to spaces
        .replace(/\r\n/g, '\n')              // Normalize line endings
        .replace(/\n{3,}/g, '\n\n')          // Remove excessive blank lines
        .trim();
}

// Handle question submission
async function handleQuestionSubmit() {
    const question = document.getElementById('code-question').value;
    const code = extractCode();
    const responseArea = document.getElementById('response-area');

    if (!question) {
        responseArea.innerHTML = '<p style="color: red;">Please enter a question</p>';
        return;
    }

    try {
        // responseArea.innerHTML = '<p>Processing your question...</p>';
        const response = await sendToGroqAPI(code, question);
        const responseText = formatStructuredResponse(response);
        const responseArray = responseText.split('###');
        for (const item of responseArray) {
            responseArea.innerHTML += `<p>${item}</p> <br>`;
        }
    } catch (error) {
        responseArea.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

function formatStructuredResponse(response) {
    // Step 1: Normalize and clean the raw response
    let cleanResponse = response
        .replace(/`~/g, '```') // Fix malformed code blocks
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .replace(/\s*([.,:;])\s*/g, '$1 ') // Fix punctuation spacing
        .trim();

    // Step 2: Split into logical sections (code vs text)
    const sections = cleanResponse.split(/(```[a-z]*\n[\s\S]*?\n```)/);

    // Step 3: Format each section with custom rules
    const formattedSections = sections.map(section => {
        if (section.startsWith('```')) {
            // Enhanced code block formatting
            const langMatch = section.match(/^```([a-z]*)/);
            const lang = langMatch ? langMatch[1] : '';
            const codeContent = section
                .replace(/^```[a-z]*\n/, '')
                .replace(/\n```$/, '')
                .replace(/^ {4}/gm, ''); // Remove forced indentation

            return `\n\`\`\`${lang}\n${codeContent}\n\`\`\`\n`;
        } else {
            // Text formatting with custom bullets and spacing
            return section
                // Convert all bullet types to •
                .replace(/(^|\n)\s*[-*+](\s+)/g, '$1•$2')
                // Format numbered lists (1. -> 1.)
                .replace(/(\d+)\.\s/g, '$1. ')
                // Add double newlines between paragraphs
                .replace(/([^\n])\n([^\n•\d])/g, '$1\n\n$2')
                // Ensure space after bullets
                .replace(/•(\w)/g, '• $1')
                // Cleanup
                .trim();
        }
    });

    // Step 4: Final assembly with consistent spacing
    return formattedSections
        .join('\n')
        .replace(/\n{3,}/g, '\n\n') // Max 2 newlines
        .replace(/(```\n)\n+/g, '$1') // No empty lines after code blocks
        .replace(/\n+(```)/g, '\n$1') // No empty lines before code blocks
        .trim();
}
    

// Function to handle API key storage and settings
async function handleApiKeySettings() {
    const settingsButton = document.getElementById('settings-button');
    const settingsSection = document.getElementById('settings-section');
    const saveButton = document.getElementById('save-api-key');
    const apiKeyInput = document.getElementById('api-key-input');
    const apiKeyStatus = document.getElementById('api-key-status');

    // Load saved API key if exists
    const savedApiKey = await chrome.storage.local.get('groqApiKey');
    if (savedApiKey.groqApiKey) {
        apiKeyInput.value = savedApiKey.groqApiKey;
        apiKeyStatus.textContent = 'API key is saved';
    }

    // Toggle settings section
    settingsButton.addEventListener('click', () => {
        settingsSection.style.display = settingsSection.style.display === 'none' ? 'block' : 'none';
    });

    // Save API key
    saveButton.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            apiKeyStatus.textContent = 'Please enter an API key';
            apiKeyStatus.style.color = '#ff4444';
            return;
        }

        try {
            // Test the API key
            const testResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: 'test' }]
                })
            });

            if (!testResponse.ok) {
                throw new Error('Invalid API key');
            }

            // Save the API key
            await chrome.storage.local.set({ groqApiKey: apiKey });
            apiKeyStatus.textContent = 'API key saved successfully';
            apiKeyStatus.style.color = '#4CAF50';
        } catch (error) {
            apiKeyStatus.textContent = 'Invalid API key. Please try again.';
            apiKeyStatus.style.color = '#ff4444';
        }
    });
}

// Modify the sendToGroqAPI function to use stored API key
async function sendToGroqAPI(code, question) {
    const { groqApiKey } = await chrome.storage.local.get('groqApiKey');
    
    if (!groqApiKey) {
        throw new Error('Please set your Groq API key in the settings');
    }
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
            model: 'mistral-saba-24b',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful code assistant that helps me understand any kind of code in easy, beginner-friendly language.
                                Your responses should:
                                    Be short, clear, and broken into small bullet points,
                                    Avoid large paragraphs,
                                    Avoid bold formatting,
                                    Arrange content neatly with proper bullet points or numbering when needed,
                                    If I ask for alternative versions of the code, look for or suggest better, cleaner, or more efficient options that produce the same output,
                                    Your goal is to make code easy to understand and help me learn with simple explanations and clean formatting.`
                },
                {
                    role: 'user',
                    content: `Here is the code:\n\n${code}\n\nQuestion: ${question}.`
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error('Failed to get response from Groq API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Modify the init function to initialize API key settings
function init() {
    debug('Initializing extension...');
    try {
        // Ensure we're in the top frame
        if (window.top === window.self) {
            createOverlayButton();
            createOverlayPanel();
            handleApiKeySettings();
            initializeCodeBlocks();
            debug('Extension initialized successfully');
        }
    } catch (error) {
        debug('Error during initialization: ' + error.message);
    }
}

// Ensure the DOM is loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // If DOMContentLoaded has already fired, run init directly
    init();
}

// Also try to initialize when the page is fully loaded
window.addEventListener('load', init);

// Add a mutation observer to ensure our elements stay on the page
const observer = new MutationObserver((mutations) => {
    if (!document.getElementById('code-assistant-button')) {
        debug('Button was removed, recreating...');
        init();
    } else {
        // Check for new code blocks
        initializeCodeBlocks();
    }
});

// Start observing the document with the configured parameters
observer.observe(document.documentElement, { 
    childList: true, 
    subtree: true,
    characterData: true 
});

// Add styles for code block highlighting with stronger specificity
const style = document.createElement('style');
style.textContent = `
    .code-assistant-highlight,
    .code-assistant-highlight *,
    *[data-selected="true"],
    *[data-selected="true"] *,
    .react-blob-textarea.react-blob-print-hide.code-assistant-highlight {
        // position: relative !important;
        // cursor: pointer !important;
        // background-color: rgba(76, 175, 80, 0.1) !important;
        // border: 2px solid #4CAF50 !important;
        // border-radius: 4px !important;
        transition: all 0.2s ease !important;
        z-index: ${CONFIG.zIndex} !important;
    }

    .code-assistant-highlight:hover,
    .code-assistant-highlight *:hover,
    *[data-selected="true"]:hover,
    *[data-selected="true"] *:hover,
    .react-blob-textarea.react-blob-print-hide.code-assistant-highlight:hover {
        background-color: rgba(76, 175, 80, 0.2) !important;
        border-color: #45a049 !important;
    }

    /* Special handling for GitHub's new code view textarea */
    .react-blob-textarea.react-blob-print-hide {
        pointer-events: auto !important;
        user-select: text !important;
        -webkit-user-select: text !important;
    }
`;
document.head.appendChild(style);

// Function to initialize code block detection
function initializeCodeBlocks() {
    debug('Initializing code block detection...');
    
    // More comprehensive selectors with GitHub-specific ones
    const CODE_SELECTORS = [
        // GitHub's new React-based code view (specific combination)
        '.react-blob-textarea.react-blob-print-hide',    // Exact class combination
        '[data-testid="read-only-cursor-text-area"]',   // Test ID selector
        '#read-only-cursor-text-area',                  // ID selector
        
        // Previous GitHub React selectors
        '.react-blob-textarea',
        '.react-code-file-contents',
        '[role="presentation"] > div > div > div',
        '.react-file-line',
        '.react-code-line-contents',
        '.react-code-text-cell',
        '.react-file-line-container',
        
        // Rest of the selectors...
        '.react-code-view',
        '.react-code-lines',
        'table[data-tagsearch-lang]',
        'div[data-tagsearch-lang]',
        'span[data-code-text]',
        '.blob-wrapper table',
        '.highlight table',
        '.markdown-body pre',
        '.js-file-line-container',
        '.blob-code-inner',
        '[data-snippet-clipboard-copy-content]',
        '.js-suggestion-code',
        'table.diff-table',
        '.markdown-body .highlight pre',
        'pre code',
        'pre.code',
        '.code-block',
        '.highlight',
        '.syntax-highlight',
        'code.hljs',
        '.CodeMirror-code',
        '.code-box-code'
    ];

    const selector = CODE_SELECTORS.join(', ');
    
    try {
        // Find all potential code blocks
        const codeBlocks = document.querySelectorAll(selector);
        debug(`Found ${codeBlocks.length} potential code blocks`);

        codeBlocks.forEach((block, index) => {
            // Skip if already initialized
            if (block.dataset.codeAssistantInitialized) return;

            // Special handling for GitHub table-based code views
            if (block.tagName === 'TABLE') {
                handleGitHubTableCode(block, index);
                return;
            }

            // Get the code content
            let text = getCodeContent(block);
            if (!text || text.trim().length < 3) return;

            initializeCodeBlock(block, index, text);
        });
    } catch (error) {
        debug('Error initializing code blocks: ' + error.message);
    }
}

// Function to handle GitHub's table-based code view
function handleGitHubTableCode(table, index) {
    // Get all code lines from the table
    const codeLines = table.querySelectorAll('.blob-code-inner, .js-file-line');
    if (!codeLines.length) return;

    // Create a container for the entire code block
    const container = document.createElement('div');
    container.className = 'code-assistant-github-container';
    container.style.position = 'relative';
    container.dataset.codeAssistantIndex = index;

    // Extract and combine the code
    let fullCode = Array.from(codeLines)
        .map(line => line.textContent || line.innerText)
        .join('\n');

    // Store the full code in a data attribute
    container.dataset.codeContent = fullCode;

    // Wrap the table with our container
    table.parentNode.insertBefore(container, table);
    container.appendChild(table);

    initializeCodeBlock(container, index, fullCode);
}

// Function to get code content from an element
function getCodeContent(element) {
    // Handle GitHub's new React-based code view with specific class combination
    if (element.classList.contains('react-blob-textarea') && element.classList.contains('react-blob-print-hide')) {
        // For this specific textarea, we need to get the value
        const code = element.value || element.textContent || element.getAttribute('aria-label');
        if (code) {
            return code;
        }
    }

    // Handle GitHub's new React-based code view
    if (element.classList.contains('react-blob-textarea')) {
        return element.value || element.textContent;
    }

    // Handle GitHub's new React file line containers
    if (element.classList.contains('react-file-line-container') ||
        element.classList.contains('react-code-file-contents')) {
        const lines = element.querySelectorAll('.react-file-line');
        if (lines.length) {
            return Array.from(lines)
                .map(line => line.textContent || line.innerText)
                .join('\n');
        }
    }

    // Previous content extraction methods...
    if (element.classList.contains('react-code-view') || 
        element.classList.contains('react-code-lines')) {
        const codeLines = element.querySelectorAll('.react-file-line, .react-code-line-contents');
        if (codeLines.length) {
            return Array.from(codeLines)
                .map(line => {
                    const codeText = line.getAttribute('data-code-text');
                    if (codeText) return codeText;
                    return line.textContent || line.innerText;
                })
                .join('\n');
        }
    }

    const codeText = element.getAttribute('data-code-text') ||
                    element.getAttribute('data-snippet-clipboard-copy-content');
    if (codeText) return codeText;

    if (element.classList.contains('blob-wrapper') || 
        element.classList.contains('highlight')) {
        const codeLines = element.querySelectorAll('.blob-code-inner, .js-file-line');
        if (codeLines.length) {
            return Array.from(codeLines)
                .map(line => line.textContent || line.innerText)
                .join('\n');
        }
    }

    return element.textContent || element.innerText;
}

// Function to initialize a single code block
function initializeCodeBlock(block, index, text) {
    // Add data attribute for tracking
    block.dataset.codeAssistantIndex = index;
    
    // Add click handler
    block.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove previous selections
        document.querySelectorAll('[data-selected="true"]').forEach(el => {
            el.dataset.selected = "false";
            el.classList.remove('code-assistant-highlight');
        });

        // Select this block
        block.dataset.selected = "true";
        block.classList.add('code-assistant-highlight');

        // Get and clean the code
        const code = cleanCode(text);
        const language = detectLanguage(block) || detectGitHubLanguage() || 'unknown';

        // Display in panel
        const codeDisplay = document.getElementById('code-display');
        if (codeDisplay) {
            codeDisplay.textContent = `Language: ${language}\n\n${code}`;
        }
    });

    // Add hover handlers
    block.addEventListener('mouseenter', () => {
        if (!block.dataset.selected) {
            block.classList.add('code-assistant-highlight');
        }
    });

    block.addEventListener('mouseleave', () => {
        if (!block.dataset.selected) {
            block.classList.remove('code-assistant-highlight');
        }
    });

    block.dataset.codeAssistantInitialized = "true";
    debug(`Initialized code block ${index}`);
}

// Function to detect GitHub's language
function detectGitHubLanguage() {
    // Try to find language from GitHub's new interface
    const codeContainer = document.querySelector('[data-tagsearch-lang], .react-code-view');
    if (codeContainer) {
        const lang = codeContainer.getAttribute('data-tagsearch-lang') || 
                    codeContainer.getAttribute('data-language');
        if (lang) return lang.toLowerCase();
    }

    // Try to find language from file info
    const languageInfo = document.querySelector('.file-info .final-path, [data-hydro-click*="filename"]');
    if (languageInfo) {
        const extension = languageInfo.textContent.split('.').pop().toLowerCase();
        const languageMap = {
            'js': 'javascript',
            'py': 'python',
            'java': 'java',
            'cpp': 'c++',
            'ts': 'typescript',
            'rb': 'ruby',
            'php': 'php',
            'html': 'html',
            'css': 'css',
            'md': 'markdown'
        };
        return languageMap[extension] || extension;
    }

    // Try to find language from repository language stats
    const languageStats = document.querySelector('.repository-lang-stats-graph');
    if (languageStats) {
        const mainLanguage = languageStats.getAttribute('aria-label');
        if (mainLanguage) {
            return mainLanguage.split(' ')[0].toLowerCase();
        }
    }

    return null;
}

// Function to toggle between selected code and all code
function toggleCodeView() {
    const toggleButton = document.getElementById('toggle-view');
    const codeDisplay = document.getElementById('code-display');
    const isShowingAll = toggleButton.textContent === 'Show Selected';
    
    if (isShowingAll) {
        // Switch to showing only selected code
        toggleButton.textContent = 'Show All Code';
        const selectedBlock = document.querySelector('[data-selected="true"]');
        if (selectedBlock) {
            const code = cleanCode(selectedBlock.textContent || selectedBlock.innerText);
            const language = detectLanguage(selectedBlock) || 'unknown';
            codeDisplay.textContent = `Language: ${language}\n\n${code}`;
        } else {
            codeDisplay.textContent = 'Click on any code block to analyze it';
        }
    } else {
        // Switch to showing all code blocks
        toggleButton.textContent = 'Show Selected';
        const allCode = getAllCodeBlocks();
        codeDisplay.textContent = allCode;
    }
}

// Function to get all code blocks
function getAllCodeBlocks() {
    const CODE_SELECTORS = [
        'pre', 'code', 
        '.code-block', '.highlight', '.syntax-highlight',
        '.highlight-source-js', '.highlight-source-python',
        '.highlight-source-java', '.blob-code-inner',
        '.prettyprint', 'code.hljs',
        '.CodeMirror-code', '.code-box-code'
    ];

    const selector = CODE_SELECTORS.join(', ');
    const codeBlocks = document.querySelectorAll(selector);
    let result = '';
    let blockCount = 0;

    codeBlocks.forEach(block => {
        const text = block.textContent || block.innerText;
        if (text && text.trim().length > 3) {
            blockCount++;
            const language = detectLanguage(block) || 'unknown';
            const code = cleanCode(text);
            result += `=== Code Block ${blockCount} (${language}) ===\n${code}\n\n`;
        }
    });

    return result || 'No code blocks found on this page';
} 