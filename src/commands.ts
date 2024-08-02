import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import type { Role, ColorResolvable, Guild, GuildMember } from "discord.js";
import { API_URL } from "./config.js";
import { ZTLRole, RoleArr, APIResponse } from "./types.js";

const embedLib = (
  title: string,
  description: string,
  color: ColorResolvable,
  footer: string
) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setFooter({
      text: footer,
    });
};

const embedSuccess = (title: string, footer: string, roles?: Role[]) => {
  return embedLib(
    title,
    roles?.map((role) => role.toString()).join(" ") || "",
    0x5cb85c,
    footer
  );
};

const embedError = (error: string, footer?: string) => {
  return embedLib(
    "Error!",
    error,
    0xff0000,
    footer || "Please try again later"
  );
};

type GetRolesResponse = {
  status: number;
  data:
    | {
        roles: ZTLRole[];
        name: string | undefined;
      }
    | EmbedBuilder;
};

/**
 * Gets roles/ratings and name from VATUSA API
 */
const getRoles = async (member: GuildMember): Promise<GetRolesResponse> => {
  const userId = member?.user.id;
  const discordName = member?.nickname;
  const url = `${API_URL}user/${userId}/?d`;
  try {
    const res = await fetch(url);
    if (res.status == 404) {
      return {
        status: 404,
        data: embedError(
          "Your Discord account is not linked on VATUSA or you are not in the VATUSA database. Link it here: https://vatusa.net/my/profile",
          "Not Linked"
        ),
      };
    } else if (res.status !== 200) {
      return {
        status: res.status,
        data: embedError(
          `'Unable to communicate with API. Status: ${res.status}`
        ),
      };
    } else {
      const response = ((await res.json()) as APIResponse).data;
      const data = {
        roles: [] as ZTLRole[],
        name: undefined as string | undefined,
      };

      if (member?.permissions.has("Administrator")) {
        return {
          status: 403,
          data: embedError(
            `Since you have an administrator role, you must contact the server owner to receive your roles.`
          ),
        };
      }

      if (
        discordName !== `${response.fname} ${response.lname}` &&
        !member?.permissions.has("Administrator")
      ) {
        data.name = `${response.fname} ${response.lname}`;
      } else {
        data.name = undefined;
      }

      response.roles.forEach((role: RoleArr) => {
        if (role.facility === "ZTL") {
          switch (role.role) {
            case "ATM":
              data.roles.push(ZTLRole.ATM, ZTLRole.ZTLSRSTAFF);
              break;
            case "DATM":
              data.roles.push(
                ZTLRole.DATM,
                ZTLRole.ZTLSRSTAFF,
                ZTLRole.ZTLSTAFF
              );
              break;
            case "TA":
              data.roles.push(ZTLRole.TA, ZTLRole.ZTLSRSTAFF);
              break;
            case "EC":
              data.roles.push(ZTLRole.EC, ZTLRole.ZTLSTAFF);
              break;
            case "FE":
              data.roles.push(ZTLRole.FE, ZTLRole.ZTLSTAFF);
              break;
            case "WM":
              data.roles.push(ZTLRole.WM, ZTLRole.ZTLSTAFF);
              break;
            case "MTR":
              data.roles.push(ZTLRole.TRNGTEAM);
              break;
            default:
              break;
          }
        }
      });

      switch (response.facility) {
        case "ZTL":
          data.roles.push(ZTLRole.ZTL);
          break;
        case "ZHQ":
          data.roles.push(ZTLRole.VATUSA);
          break;
        default:
          if (
            response.visiting_facilities.some((role) => role.facility === "ZTL")
          ) {
            data.roles.push(ZTLRole.VISITOR);
          } else {
            data.roles.push(ZTLRole.VATSIM);
          }
          break;
      }

      if (Object.values(ZTLRole).includes(response.rating_short as ZTLRole)) {
        if (response.rating_short === "OBS") {
          data.roles.push(ZTLRole.OBS);
        } else {
          data.roles.push(response.rating_short as ZTLRole);
          if (response.rating_short.includes("I")) {
            data.roles.push(ZTLRole.TRNGTEAM);
          }
        }
      }

      return {
        status: 200,
        data,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      data: embedError("An error occurred while fetching data."),
    };
  }
};

export const addRoles = async (
  member: GuildMember,
  guild: Guild,
  interaction?: ChatInputCommandInteraction<CacheType>
) => {
  const userData = await getRoles(member);

  if (userData.data instanceof EmbedBuilder) {
    if (interaction) {
      await interaction.reply({ embeds: [userData.data] });
    } else {
      return {
        status: userData.status,
        message: userData.data.data.description,
      };
    }
  } else {
    const { roles, name } = userData.data;

    const newRoles: Role[] = roles.map((roles) => {
      return guild?.roles.cache.find((role) => role.name === roles) as Role;
    });

    try {
      await member?.roles.remove(
        member?.roles.cache.filter(
          (role) =>
            Object.values(ZTLRole).includes(role.name as ZTLRole) &&
            role.name !== "@everyone"
        )
      );
      if (name && name !== member?.nickname) {
        await member?.setNickname(name);
      }
      await member?.roles.add([
        ...member.roles.cache.map((role) => role),
        ...newRoles,
      ]);
      if (interaction) {
        await interaction.reply({
          embeds: [
            embedSuccess(
              "Your roles have been assigned.",
              name
                ? `Your new nickname is: ${name}`
                : member?.displayName || "",
              newRoles
            ),
          ],
        });
      } else {
        return {
          status: 200,
          message: `Roles added to ${member.nickname}`,
        };
      }
    } catch (error) {
      console.error(error);
      if (interaction) {
        await interaction.reply({
          embeds: [embedError("An error occurred while giving the role.")],
        });
      } else {
        return {
          status: 500,
          message: "An error occurred while giving the role.",
        };
      }
    }
  }
};
