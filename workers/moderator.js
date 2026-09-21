self.onmessage = async function (event) {
    const text = event.data.text;

    try {
        const response = await fetch(
            "../data/vulgar.json"
        );

        if (!response.ok) {
            throw new Error(
                "Could not load vulgar words."
            );
        }

        const vulgarWords =
            await response.json();

        const lowerCaseText = text.toLowerCase();

        for (const word of vulgarWords) {
            const lowerCaseWord =
                word.toLowerCase();

            const escapedWord =
                lowerCaseWord.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );

            const wordRegex = new RegExp(
                `\\b${escapedWord}\\b`,
                "i"
            );

            if (wordRegex.test(lowerCaseText)) {
                self.postMessage({
                    allowed: false,
                    word: word
                });

                return;
            }
        }

        self.postMessage({
            allowed: true
        });
    } catch (error) {
        console.error(
            "Moderation worker error:",
            error
        );

        self.postMessage({
            allowed: false,
            word: "unknown"
        });
    }
};