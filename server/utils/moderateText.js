const moderateContent = async (text) => {
    const res = await fetch("http://localhost:8000/moderate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    }); const scores = await res.json();
    return scores;
}; 
module.exports = moderateContent;