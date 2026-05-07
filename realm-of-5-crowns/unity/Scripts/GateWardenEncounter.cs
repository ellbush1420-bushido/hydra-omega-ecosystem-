using UnityEngine;

public class GateWardenEncounter : MonoBehaviour
{
    public int playerHealth = 20;
    public int wardenHealth = 15;
    public int successThreshold = 12;
    public int failedMovePenalty = 2;

    public void FadeIntoWalls()
    {
        ResolveMove(8, 5);
    }

    public void StrikeFirst()
    {
        ResolveMove(6, 4);
    }

    public void ShadowBind()
    {
        ResolveMove(4, 3);
    }

    void ResolveMove(int bonus, int damage)
    {
        int roll = Random.Range(1, 10) + bonus;
        if (roll > successThreshold)
        {
            wardenHealth -= damage;
            return;
        }

        playerHealth -= failedMovePenalty;
    }
}
