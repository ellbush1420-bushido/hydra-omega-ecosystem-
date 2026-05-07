using UnityEngine;

public class GateWardenEncounter : MonoBehaviour
{
    public int playerHealth = 20;
    public int wardenHealth = 15;

    public void FadeIntoWalls()
    {
        int roll = Random.Range(1, 10) + 8;
        if (roll > 12)
        {
            wardenHealth -= 5;
        }
    }

    public void StrikeFirst()
    {
        int roll = Random.Range(1, 10) + 6;
        if (roll > 12)
        {
            wardenHealth -= 4;
        }
    }

    public void ShadowBind()
    {
        int roll = Random.Range(1, 10) + 4;
        if (roll > 12)
        {
            wardenHealth -= 3;
        }
    }
}
