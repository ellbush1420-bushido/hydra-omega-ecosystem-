using UnityEngine;

public enum PlayerChoice
{
    Fade,
    Strike,
    Bind,
    Observe
}

public class EncounterManager : MonoBehaviour
{
    public int playerHealth = 20;
    public int wardenHealth = 15;

    public int veil = 8;
    public int edge = 6;
    public int flux = 4;
    public int pulse = 7;

    public GameObject uiPanel;
    public UnityEngine.UI.Text logText;
    public UnityEngine.UI.Slider playerHealthBar;
    public UnityEngine.UI.Slider wardenHealthBar;

    bool encounterActive = false;

    void Start()
    {
        uiPanel.SetActive(false);
        UpdateHealthUI();
    }

    public void StartEncounter()
    {
        encounterActive = true;
        uiPanel.SetActive(true);
        Log("The Gate Warden emerges from the shadows.");
    }

    public void OnChoiceFade() { ResolveChoice(PlayerChoice.Fade); }
    public void OnChoiceStrike() { ResolveChoice(PlayerChoice.Strike); }
    public void OnChoiceBind() { ResolveChoice(PlayerChoice.Bind); }
    public void OnChoiceObserve() { ResolveChoice(PlayerChoice.Observe); }

    void ResolveChoice(PlayerChoice choice)
    {
        if (!encounterActive) return;

        int roll = Random.Range(1, 11);
        switch (choice)
        {
            case PlayerChoice.Fade:
                int fadeScore = roll + veil;
                if (fadeScore > 12)
                {
                    wardenHealth -= 5;
                    Log($"You fade into the walls (roll {fadeScore}) and strike from nowhere. Warden -5 HP.");
                }
                else
                {
                    playerHealth -= 3;
                    Log($"You misjudge the shadows (roll {fadeScore}). The Warden clips you. You -3 HP.");
                }
                break;

            case PlayerChoice.Strike:
                int strikeScore = roll + edge;
                if (strikeScore > 12)
                {
                    wardenHealth -= 4;
                    Log($"You strike first (roll {strikeScore}). Clean hit. Warden -4 HP.");
                }
                else
                {
                    playerHealth -= 4;
                    Log($"You overcommit (roll {strikeScore}). The Warden counters. You -4 HP.");
                }
                break;

            case PlayerChoice.Bind:
                int bindScore = roll + flux;
                if (bindScore > 12)
                {
                    wardenHealth -= 3;
                    Log($"Shadows bind its legs (roll {bindScore}). Warden -3 HP.");
                }
                else
                {
                    playerHealth -= 2;
                    Log($"The shadows slip (roll {bindScore}). You lose position. You -2 HP.");
                }
                break;

            case PlayerChoice.Observe:
                int observeScore = roll + pulse;
                if (observeScore > 12)
                {
                    veil += 1;
                    edge += 1;
                    Log($"You read its rhythm (roll {observeScore}). Veil+1, Edge+1.");
                }
                else
                {
                    Log($"You hesitate (roll {observeScore}). No gain.");
                }
                break;
        }

        UpdateHealthUI();
        CheckEnd();
    }

    void UpdateHealthUI()
    {
        if (playerHealthBar != null)
            playerHealthBar.value = Mathf.Max(playerHealth, 0);
        if (wardenHealthBar != null)
            wardenHealthBar.value = Mathf.Max(wardenHealth, 0);
    }

    void CheckEnd()
    {
        if (wardenHealth <= 0)
        {
            Log("The Gate Warden falls. Trial of Steel: Victory.");
            encounterActive = false;
        }
        else if (playerHealth <= 0)
        {
            Log("You fall to the Gate Warden. Trial of Steel: Defeat.");
            encounterActive = false;
        }
    }

    void Log(string msg)
    {
        if (logText != null)
            logText.text = msg;
        Debug.Log(msg);
    }
}
